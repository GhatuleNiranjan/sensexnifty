import Link from "next/link";
import { Post } from "@/types";

interface OpinionSectionProps {
    articles: Post[];
}

export default function OpinionSection({ articles }: OpinionSectionProps) {
    return (
        <section className="my-12 py-10 px-4 md:px-8 bg-[#F8F8F8] border-y border-[#E0E0E0]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-baseline mb-8 border-b border-[#E0E0E0] pb-3">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((item: Post) => (
                        <div
                            key={item.id}
                            className="group p-6 bg-white border border-[#E0E0E0] border-t-2 border-t-[#6B1C2A] shadow-sm hover:bg-[#FAF9F6] transition-colors flex flex-col justify-between"
                        >
                            <div>
                                <span className="text-[10px] font-bold tracking-widest text-[#6B1C2A] uppercase">
                                    EDITORIAL COLUMN
                                </span>
                                <Link href={`/${item.category.toLowerCase()}/${item.slug}`}>
                                    <h3
                                        className="text-lg md:text-xl font-bold text-[#1A1A1A] mt-2 leading-snug group-hover:text-[#1A3A5C] transition-colors"
                                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                                    >
                                        &ldquo;{item.title}&rdquo;
                                    </h3>
                                </Link>
                                <p className="mt-3 text-xs md:text-sm text-[#6B6B6B] leading-relaxed italic">
                                    {item.summary}
                                </p>
                            </div>
                            <div className="mt-6 pt-3 border-t border-[#E0E0E0] flex justify-between items-center text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                                <span>BY {item.author || "THE SENSEXNIFTY DESK"}</span>
                                <span className="text-[#6B1C2A]">OPINION</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}