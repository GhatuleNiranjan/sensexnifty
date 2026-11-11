import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import Navigation from "@/components/public/Navigation";
import EditionStrip from "@/components/public/EditionStrip";
import Footer from "@/components/public/Footer";
import { getArticleBySlug } from "@/lib/posts";
import { formatFullArticleDate } from "@/lib/date";

interface ArticlePageProps {
    params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const resolvedParams = await params;
    const article = await getArticleBySlug(resolvedParams.slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <TopBar />
            <Masthead />
            <Navigation />
            <EditionStrip />

            <article className="max-w-4xl mx-auto px-4 py-10">
                <Link href={`/${article.category.toLowerCase()}`} className="inline-block mb-6 text-sm hover:underline">← Back to {article.category}</Link>
                <div className="flex items-center space-x-2 text-xs font-bold tracking-widest text-[#1A3A5C] uppercase mb-3">
                    <Link href={`/${article.category.toLowerCase()}`} className="hover:underline">
                        {article.category}
                    </Link>
                    {article.location && (
                        <span className="text-[#6B6B6B]">· {article.location}</span>
                    )}
                </div>

                <h1
                    className="text-3xl md:text-5xl font-black text-[#1A1A1A] leading-[1.15] tracking-tight"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                    {article.title}
                </h1>

                <p className="mt-4 text-base md:text-xl text-[#6B6B6B] italic leading-relaxed border-l-2 border-[#1A3A5C] pl-4">
                    {article.summary}
                </p>

                <div className="mt-6 py-3 border-y border-[#E0E0E0] flex flex-wrap items-center justify-between text-xs text-[#6B6B6B] gap-4">
                    <div className="flex items-center space-x-3">
                        <span className="font-bold text-[#1A1A1A] uppercase tracking-wider">
                            BY {article.author}
                        </span>
                        <span>·</span>
                        <time>{formatFullArticleDate(article.publishedAt)}</time>
                    </div>
                </div>

                {article.imageUrl && (
                    <figure className="my-8">
                        <div className="relative w-full aspect-[16/9] bg-[#F5F5F0] border border-[#E0E0E0] overflow-hidden">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 896px"
                            />
                        </div>
                        {article.imageCaption && (
                            <figcaption className="mt-2 text-xs text-[#6B6B6B] border-l border-[#E0E0E0] pl-2">
                                {article.imageCaption}
                            </figcaption>
                        )}
                    </figure>
                )}

                <div className="prose prose-lg max-w-none text-[#1A1A1A] leading-relaxed text-base md:text-lg">
                    {article.content?.includes("</") ? <div dangerouslySetInnerHTML={{ __html: article.content }} /> : article.content?.split("\n\n").map((paragraph: string, index: number) => {
                        if (paragraph.startsWith("### ")) {
                            return (
                                <h3
                                    key={index}
                                    className="text-xl md:text-2xl font-bold text-[#1A1A1A] mt-8 mb-4 border-b border-[#E0E0E0] pb-2"
                                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                                >
                                    {paragraph.replace("### ", "")}
                                </h3>
                            );
                        }

                        if (paragraph.startsWith("> **Disclaimer:**")) {
                            return (
                                <div
                                    key={index}
                                    className="my-8 p-5 bg-[#F8F8F8] border-l-4 border-[#1A3A5C] text-xs md:text-sm text-[#6B6B6B] leading-relaxed"
                                >
                                    <strong className="text-[#1A1A1A] uppercase block mb-1">
                                        SEBI / Market Disclaimer:
                                    </strong>
                                    {paragraph.replace("> **Disclaimer:** ", "").replace(/\*/g, "")}
                                </div>
                            );
                        }

                        if (paragraph.trim() === "---") {
                            return <hr key={index} className="my-6 border-[#E0E0E0]" />;
                        }

                        return (
                            <p key={index} className="mb-5 leading-relaxed text-[#1A1A1A]">
                                {paragraph}
                            </p>
                        );
                    })}
                </div>

                <div className="mt-12 pt-6 border-t border-[#1A1A1A] flex justify-between items-center text-xs uppercase tracking-widest text-[#6B6B6B]">
                    <span>SENSEXNIFTY FINANCIAL REPORTING</span>
                    <Link href={`/${article.category.toLowerCase()}`} className="text-[#1A3A5C] font-bold hover:underline">
                        MORE {article.category} NEWS →
                    </Link>
                </div>
            </article>

            <Footer />
        </main>
    );
}
