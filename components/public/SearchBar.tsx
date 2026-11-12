"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    variant?: "topbar" | "page";
    initialQuery?: string;
}

export default function SearchBar({
    variant = "topbar",
    initialQuery = "",
}: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`);
        setOpen(false);
    };

    if (variant === "page") {
        return (
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
                <div className="relative flex items-center">
                    <Search className="w-4 h-4 absolute left-4 text-[#6B6B6B]" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search markets, geopolitics, authors, tags..."
                        className="w-full pl-11 pr-4 py-3 text-sm font-sans bg-white border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="absolute right-2 bg-[#1A1A1A] text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-[#333333] transition-colors"
                    >
                        Search
                    </button>
                </div>
            </form>
        );
    }

    // TopBar compact variant
    return (
        <div className="relative flex items-center">
            {!open ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1 hover:text-[#1A1A1A] transition-colors uppercase"
                    aria-label="Open search"
                >
                    <Search className="w-3 h-3" />
                    <span className="hidden sm:inline">Search</span>
                </button>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-1 absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-[#E0E0E0] shadow-sm z-50"
                >
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search SensexNifty..."
                        className="w-40 sm:w-56 pl-3 pr-2 py-1.5 text-xs font-sans bg-white focus:outline-none text-[#1A1A1A]"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="p-1.5 text-[#1A1A1A] hover:bg-[#F5F5F0]"
                        aria-label="Submit search"
                    >
                        <Search className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            setQuery("");
                        }}
                        className="p-1.5 text-[#6B6B6B] hover:bg-[#F5F5F0] border-l border-[#E0E0E0]"
                        aria-label="Close search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </form>
            )}
        </div>
    );
}