"use client";

import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";
import { formatNewsDate } from "@/lib/date";
import { useState } from "react";

interface HeroSectionProps {
    article: Post;
    secondaryArticles?: Post[];
}

export default function HeroSection({ article, secondaryArticles = [] }: HeroSectionProps) {
    const fallback =
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop";
    const [imgSrc, setImgSrc] = useState(article.imageUrl || fallback);

    return (
        <div className="border-b lg:border-b-0 lg:border-r border-[#E0E0E0] lg:pr-8 pb-8 lg:pb-0 space-y-8">
            {/* Main Top Story Article */}
            <article className="group">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-4 flex-wrap">
                    <span className="bg-[#6B1C2A] text-white px-2 py-0.5">TOP STORY</span>
                    <span className="text-[#1A3A5C] font-bold">{article.category}</span>
                    {article.location && (
                        <span className="text-[#6B6B6B]">· {article.location}</span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-6 relative aspect-[16/10] bg-[#F5F5F0] border border-[#E0E0E0] overflow-hidden">
                        <Image
                            src={imgSrc}
                            alt={article.title}
                            fill
                            priority
                            onError={() => setImgSrc(fallback)}
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    <div className="md:col-span-6 flex flex-col justify-between h-full">
                        <div>
                            <Link href={`/${article.category.toLowerCase()}/${article.slug}`}>
                                <h2
                                    className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] leading-snug group-hover:text-[#1A3A5C] transition-colors"
                                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                                >
                                    {article.title}
                                </h2>
                            </Link>

                            {article.subtitle && (
                                <p className="mt-2 text-sm italic font-serif text-[#1A3A5C] border-l-2 border-[#1A3A5C] pl-3">
                                    {article.subtitle}
                                </p>
                            )}

                            <p className="mt-3 text-xs md:text-sm text-[#6B6B6B] leading-relaxed">
                                {article.summary}
                            </p>
                        </div>

                        <div className="mt-6 pt-3 border-t border-[#E0E0E0] text-[10px] md:text-[11px] text-[#6B6B6B] uppercase tracking-wider flex items-center justify-between gap-2">
                            <span className="font-semibold text-[#1A1A1A]">
                                BY {article.author || "THE SENSEXNIFTY DESK"}
                            </span>
                            <span>{formatNewsDate(article.publishedAt)}</span>
                        </div>
                    </div>
                </div>
            </article>

            {/* Secondary Spotlight Stories (Fills the remaining height) */}
            {secondaryArticles.length > 0 && (
                <div className="pt-6 border-t-2 border-[#1A1A1A]">
                    <div className="text-[10px] font-bold tracking-widest text-[#1A3A5C] uppercase mb-4">
                        FEATURED IN THIS EDITION
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {secondaryArticles.slice(0, 2).map((sec) => (
                            <article
                                key={sec.id}
                                className="group p-4 bg-[#F8F8F8] border border-[#E0E0E0] flex flex-col justify-between hover:bg-[#FAF9F6] transition-colors"
                            >
                                <div>
                                    <div className="text-[10px] font-bold tracking-widest text-[#6B6B6B] uppercase mb-1">
                                        {sec.category}
                                    </div>
                                    <Link href={`/${sec.category.toLowerCase()}/${sec.slug}`}>
                                        <h3
                                            className="text-sm font-bold text-[#1A1A1A] leading-snug group-hover:text-[#1A3A5C] transition-colors line-clamp-2"
                                            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                                        >
                                            {sec.title}
                                        </h3>
                                    </Link>
                                    {sec.summary && (
                                        <p className="mt-2 text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed">
                                            {sec.summary}
                                        </p>
                                    )}
                                </div>
                                <div className="mt-4 pt-2 border-t border-[#E0E0E0] text-[10px] text-[#6B6B6B] uppercase flex justify-between">
                                    <span>{sec.author || "EDITORIAL"}</span>
                                    <span>{formatNewsDate(sec.publishedAt)}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}