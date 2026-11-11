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
        <article className="group flex flex-col justify-between h-full p-5 bg-white border border-[#E0E0E0] border-t-2 border-t-[#1A3A5C] hover:bg-[#FAF9F6] transition-colors shadow-sm">
            <div>
                {showImage && article.imageUrl && (
                    <div className="relative aspect-[16/9] bg-[#F5F5F0] overflow-hidden border border-[#E0E0E0] mb-4">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    </div>
                )}

                <div className="text-[10px] font-bold tracking-widest text-[#1A3A5C] uppercase mb-1.5 flex items-center justify-between">
                    <span>
                        {article.category}
                        {article.location ? ` · ${article.location}` : ""}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#1A3A5C]/20 group-hover:bg-[#1A3A5C] transition-colors" />
                </div>

                <Link href={`/${article.category.toLowerCase()}/${article.slug}`}>
                    <h3
                        className="text-base md:text-lg font-bold text-[#1A1A1A] leading-snug group-hover:text-[#1A3A5C] transition-colors"
                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                        {article.title}
                    </h3>
                </Link>

                {article.summary && (
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
                )}
            </div>

            <div className="mt-5 text-[10px] text-[#6B6B6B] uppercase tracking-wider flex justify-between items-center gap-2 pt-3 border-t border-[#E0E0E0]">
                <span className="font-semibold text-[#1A1A1A]">
                    {article.author ? `BY ${article.author}` : "THE SENSEXNIFTY DESK"}
                </span>
                <span className="text-right text-[#6B6B6B] font-medium">
                    {formatNewsDate(article.publishedAt)}
                </span>
            </div>
        </article>
    );
}