import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import CategoryNav from "@/components/public/CategoryNav";
import EditionStrip from "@/components/public/EditionStrip";
import Footer from "@/components/public/Footer";
import { getArchivePosts } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ year: string; month: string }>;
}): Promise<Metadata> {
    const { year, month } = await params;
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (isNaN(m) || isNaN(y) || m < 1 || m > 12) {
        return { title: "Archive | SensexNifty" };
    }

    const monthName = MONTH_NAMES[m - 1];
    return {
        title: `${monthName} ${y} Archive | SensexNifty`,
        description: `All dispatches published on SensexNifty during ${monthName} ${y}.`,
    };
}

export default async function MonthlyArchivePage({
    params,
}: {
    params: Promise<{ year: string; month: string }>;
}) {
    const { year, month } = await params;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
        notFound();
    }

    const monthName = MONTH_NAMES[m - 1];
    const posts = await getArchivePosts({ year: y, month: m });

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-serif">
            <TopBar />
            <Masthead />
            <CategoryNav />
            <EditionStrip />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Navigation Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href="/archive"
                        className="text-xs font-sans font-bold uppercase tracking-widest text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Archive Index
                    </Link>
                </div>

                {/* Title Banner */}
                <div className="pb-6 mb-8 border-b-2 border-[#1A1A1A] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.25em] text-[#6B6B6B]">
                            Monthly Archive Record
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
                            Dispatches: {monthName} {y}
                        </h1>
                    </div>
                    <p className="text-xs font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                        {posts.length} Dispatch{posts.length === 1 ? "" : "es"} Logged
                    </p>
                </div>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="p-12 text-center bg-[#F8F8F8] border border-[#E0E0E0] my-8">
                        <p className="font-serif italic text-base text-[#6B6B6B]">
                            No published dispatches logged for {monthName} {y}.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => {
                            const author = post.author || {
                                name: "The SensexNifty Desk",
                                image:
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
                            };

                            const publishedDate = post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                : "TODAY";

                            return (
                                <article
                                    key={post.id}
                                    className="p-5 bg-white border border-[#E0E0E0] flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
                                >
                                    <div className="space-y-3">
                                        {post.imageUrl && (
                                            <Link
                                                href={`/${post.category.toLowerCase()}/${post.slug}`}
                                                className="block overflow-hidden border border-[#E0E0E0]"
                                            >
                                                <div className="relative aspect-[16/9] w-full bg-[#F8F8F8]">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover hover:scale-[1.01] transition-transform duration-300"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                </div>
                                            </Link>
                                        )}

                                        <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                                            <span className="text-[#1A3A5C]">{post.category}</span>
                                            {post.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{post.location}</span>
                                                </>
                                            )}
                                        </div>

                                        <Link href={`/${post.category.toLowerCase()}/${post.slug}`}>
                                            <h2 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#1A3A5C] transition-colors">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        {post.summary && (
                                            <p className="font-sans text-xs text-[#6B6B6B] line-clamp-3 leading-relaxed">
                                                {post.summary}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-[#E0E0E0] flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#6B6B6B]">
                                        <div className="flex items-center gap-2 truncate max-w-[150px]">
                                            <img
                                                src={
                                                    author.image ||
                                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                                                }
                                                alt={author.name}
                                                className="w-4 h-4 rounded-full object-cover shrink-0"
                                            />
                                            <span className="truncate text-[#1A1A1A]">
                                                {author.name}
                                            </span>
                                        </div>
                                        <span>{publishedDate}</span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}