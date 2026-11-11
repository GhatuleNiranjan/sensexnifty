import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import { formatNewsDate } from "@/lib/date";

interface ArticleCardProps {
    article: Post;
    showImage?: boolean;
}

export default function ArticleCard({ article, showImage = true }: ArticleCardProps) {
    return (
        <article className="group flex flex-col justify-between h-full py-4 border-b border-[#E0E0E0]">
            <div>
                {showImage && article.imageUrl && (
                    <div className="relative aspect-[16/9] bg-[#F5F5F0] overflow-hidden border border-[#E0E0E0] mb-3">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    </div>
                )}

                <div className="text-[10px] font-bold tracking-widest text-[#1A3A5C] uppercase mb-1">
                    {article.category}
                    {article.location ? ` · ${article.location}` : ""}
                </div>

                <Link href={`/${article.category.toLowerCase()}/${article.slug}`}>
                    <h3
                        className="text-base font-bold text-[#1A1A1A] leading-snug group-hover:text-[#1A3A5C] transition-colors"
                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                        {article.title}
                    </h3>
                </Link>

                <p
                    className="mt-2 text-xs text-[#6B6B6B] leading-relaxed"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {article.summary}
                </p>
            </div>

            <div className="mt-4 text-[10px] text-[#6B6B6B] uppercase tracking-wider flex justify-between items-center gap-2 pt-2 border-t border-[#F0F0F0]">
                <span>{article.author}</span>
                <span className="text-right">{formatNewsDate(article.publishedAt)}</span>
            </div>
        </article>
    );
}