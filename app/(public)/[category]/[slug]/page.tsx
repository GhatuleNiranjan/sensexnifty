import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

interface PostPageProps {
    params: Promise<{
        category: string;
        slug: string;
    }>;
}

export default async function ArticlePage({ params }: PostPageProps) {
    const { category, slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug },
    });

    if (!post || post.category.toLowerCase() !== category.toLowerCase()) {
        notFound();
    }

    const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const formattedTime = new Date(post.publishedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return (
        <article className="max-w-4xl mx-auto px-4 py-8 font-serif">
            {/* Category Breadcrumb */}
            <div className="mb-4">
                <Link
                    href={`/${post.category}`}
                    className="text-xs font-sans font-bold tracking-widest text-[#1A3A5C] uppercase hover:underline"
                >
                    {post.category}
                </Link>
            </div>

            {/* Main Title / Headline */}
            <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-4">
                {post.title}
            </h1>

            {/* Subtitle / Deck */}
            {post.subtitle && (
                <p className="font-serif text-lg md:text-xl text-[#6B6B6B] italic mb-6 border-l-2 border-[#1A3A5C] pl-4">
                    {post.subtitle}
                </p>
            )}

            {/* Metadata Line */}
            <div className="flex items-center justify-between text-xs font-sans text-[#6B6B6B] border-t border-b border-[#E0E0E0] py-3 mb-8 uppercase tracking-wider">
                <div>
                    <span className="font-bold text-[#1A1A1A]">BY {post.authorName}</span>
                    <span className="mx-2">•</span>
                    <span>{formattedDate} · {formattedTime} IST</span>
                </div>
            </div>

            {/* Featured Image */}
            {post.imageUrl && (
                <div className="mb-8">
                    <div className="relative aspect-[16/9] w-full bg-[#F5F5F0] border border-[#E0E0E0] overflow-hidden">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                            className="object-cover"
                            priority
                        />
                    </div>
                    {post.imageCaption && (
                        <p className="mt-2 text-xs font-sans text-[#6B6B6B] uppercase tracking-wider">
                            {post.imageCaption}
                        </p>
                    )}
                </div>
            )}

            {/* Article Content Body */}
            <div
                className="prose prose-lg max-w-none font-serif text-[#1A1A1A] leading-relaxed [&_p]:mb-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1A3A5C] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Bottom Section Divider */}
            <div className="mt-12 pt-6 border-t border-[#E0E0E0] flex justify-between items-center text-xs font-sans text-[#6B6B6B]">
                <span>SENSEXNIFTY FINANCIAL REPORTING</span>
                <Link
                    href={`/${post.category}`}
                    className="hover:text-[#1A3A5C] font-semibold uppercase tracking-wider"
                >
                    MORE {post.category} NEWS →
                </Link>
            </div>
        </article>
    );
}