"use client";

import Link from "next/link";
import { SITE_CONFIG, CATEGORIES } from "@/lib/constants";

export default function Footer() {
    return (
        <footer
            style={{ borderTop: "2px solid #1A1A1A" }}
            className="bg-white mt-16 pt-12 pb-8 font-sans"
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#E0E0E0]">
                    {/* Brand */}
                    <div className="md:col-span-4">
                        <h2
                            className="text-3xl font-black uppercase text-[#1A1A1A]"
                            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                        >
                            {SITE_CONFIG.name}
                        </h2>
                        <p className="text-xs text-[#6B6B6B] uppercase tracking-widest mt-1 font-semibold">
                            {SITE_CONFIG.tagline}
                        </p>
                        <p className="mt-4 text-xs text-[#6B6B6B] leading-relaxed">
                            Independent financial journalism covering markets, geopolitics,
                            and global economies with context and rigor.
                        </p>
                    </div>

                    {/* Sections */}
                    <div className="md:col-span-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
                            Coverage Sections
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#6B6B6B]">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/${cat.slug}`}
                                    className="hover:text-[#1A3A5C] uppercase tracking-wider"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Desk */}
                    <div className="md:col-span-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] mb-3">
                            Editorial Desk
                        </h3>
                        <p className="text-xs text-[#6B6B6B] leading-relaxed">
                            For editorial inquiries or correction requests, contact the desk
                            at:
                        </p>
                        <p className="text-xs font-bold text-[#1A1A1A] mt-1">
                            {SITE_CONFIG.adminEmail}
                        </p>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#6B6B6B] tracking-wider uppercase gap-2">
                    <p>© 2026 SensexNifty. All rights reserved.</p>
                    <p>Independent Financial Journalism</p>
                </div>
            </div>
        </footer>
    );
}