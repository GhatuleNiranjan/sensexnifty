"use client";

import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";
import { formatNewsDate } from "@/lib/date";
import { useState } from "react";

interface HeroSectionProps {
    article: Post;
}

export default function HeroSection({ article }: HeroSectionProps) {
    const fallback =
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop";
    const [imgSrc, setImgSrc] = useState(article.imageUrl || fallback);

    return (
        <article className="group border-b lg:border-b-0 lg:border-r border-[#E0E0E0] lg:pr-8 pb-8 lg:pb-0">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-4 flex-wrap">
                <span className="bg-[#1A1A1A] text-white px-2 py-0.5">TOP STORY</span>
                <span className="text-[#1A3A5C] font-bold">{article.category}</span>
                {article.location && (
                    <span className="text-[#6B6B6B]">· {article.location}</span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 relative aspect-[4/3] bg-[#F5F5F0] border border-[#E0E0E0] overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={article.title}
                        fill
                        priority
                        onError={() => setImgSrc(fallback)}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 40vw"
                    />
                </div>

                <div className="md:col-span-7 flex flex-col justify-between min-h-[180px]">
                    <div>
                        <Link href={`/${article.category.toLowerCase()}/${article.slug}`}>
                            <h2
                                className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#1A1A1A] leading-snug group-hover:text-[#1A3A5C] transition-colors"
                                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                            >
                                {article.title}
                            </h2>
                        </Link>
                        <p className="mt-3 text-sm text-[#1A1A1A] leading-relaxed">
                            {article.summary}
                        </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-[#E0E0E0] text-[10px] md:text-[11px] text-[#6B6B6B] uppercase tracking-wider flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#1A1A1A]">{article.author}</span>
                        <span>{formatNewsDate(article.publishedAt)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}