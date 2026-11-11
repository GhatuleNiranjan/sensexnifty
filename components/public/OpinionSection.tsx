import Link from "next/link";
import { Post } from "@/types";

interface OpinionSectionProps {
    articles: Post[];
}

export default function OpinionSection({ articles }: OpinionSectionProps) {
    return (
        <section className="my-12 p-8 bg-[#F8F8F8] border-y border-[#E0E0E0]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-baseline mb-6 border-b border-[#E0E0E0] pb-2">
                    <h2
                        className="text-xl font-extrabold uppercase text-[#1A1A1A] tracking-wide"
                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                        Opinion & Perspective
                    </h2>
                    <Link
                        href="/opinion"
                        className="text-xs font-bold text-[#1A3A5C] hover:underline uppercase tracking-wider"
                    >
                        ALL ESSAYS →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map((item: Post) => (
                        <div
                            key={item.id}
                            className="group border-b md:border-b-0 md:border-r border-[#E0E0E0] last:border-r-0 pr-0 md:pr-8 pb-6 md:pb-0"
                        >
                            <span className="text-[10px] font-bold tracking-widest text-[#6B1C2A] uppercase">
                                EDITORIAL COLUMN
                            </span>
                            <Link href={`/${item.category.toLowerCase()}/${item.slug}`}>
                                <h3
                                    className="text-lg md:text-xl font-bold text-[#1A1A1A] mt-1 leading-snug group-hover:text-[#1A3A5C] transition-colors"
                                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                                >
                                    "{item.title}"
                                </h3>
                            </Link>
                            <p className="mt-3 text-xs md:text-sm text-[#6B6B6B] leading-relaxed italic">
                                {item.summary}
                            </p>
                            <p className="mt-4 text-[11px] font-bold text-[#1A1A1A] uppercase">
                                BY {item.author}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}