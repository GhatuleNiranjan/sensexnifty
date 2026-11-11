import Link from "next/link";
import { Post } from "@/types";
import { formatNewsDate } from "@/lib/date";

interface LatestSidebarProps {
    articles: Post[];
}

export default function LatestSidebar({ articles }: LatestSidebarProps) {
    return (
        <aside className="lg:pl-8">
            <div className="border-b border-[#1A1A1A] pb-2 mb-6">
                <h3
                    className="text-xl font-bold text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                    The latest
                </h3>
            </div>

            <div className="divide-y divide-[#E0E0E0]">
                {articles.map((item: Post) => (
                    <article key={item.id} className="py-5 first:pt-0 last:pb-0 group">
                        <div className="text-[10px] font-bold tracking-widest text-[#6B6B6B] uppercase mb-1.5 flex items-center justify-between gap-2">
                            <span className="text-[#1A3A5C]">{item.category}</span>
                            <span className="text-right">{formatNewsDate(item.publishedAt)}</span>
                        </div>

                        <Link href={`/${item.category.toLowerCase()}/${item.slug}`}>
                            <h4
                                className="text-base font-bold text-[#1A1A1A] leading-snug group-hover:text-[#1A3A5C] transition-colors"
                                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                            >
                                {item.title}
                            </h4>
                        </Link>

                        <p
                            className="mt-2 text-xs text-[#6B6B6B] leading-relaxed"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {item.summary}
                        </p>
                    </article>
                ))}
            </div>
        </aside>
    );
}