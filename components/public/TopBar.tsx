"use client";

import Link from "next/link";
import SearchBar from "@/components/public/SearchBar";

export default function TopBar() {
    const todayFormatted = new Date()
        .toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        .toUpperCase();

    return (
        <div className="bg-[#F5F5F0] border-b border-[#E0E0E0] text-[10px] font-sans font-semibold tracking-wider text-[#6B6B6B]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <span className="truncate">{todayFormatted}</span>
                    <span className="hidden sm:inline text-[#E0E0E0]">|</span>
                    <span className="hidden sm:inline uppercase">
                        Global Financial Edition
                    </span>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <span className="hidden md:inline uppercase text-[#1A3A5C] font-bold">
                        Updated Throughout The Day
                    </span>
                    <Link
                        href="/archive"
                        className="hidden sm:inline hover:text-[#1A1A1A] transition-colors uppercase"
                    >
                        Archive
                    </Link>
                    <SearchBar variant="topbar" />
                </div>
            </div>
        </div>
    );
}