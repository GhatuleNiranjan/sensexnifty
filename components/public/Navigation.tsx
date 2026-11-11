import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { Search } from "lucide-react";

export default function Navigation() {
    return (
        <nav className="border-b border-[#E0E0E0] bg-white sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12 gap-4">
                <div className="flex items-center gap-4 md:gap-8 overflow-x-auto py-2 flex-1">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/${cat.slug}`}
                            className="text-xs font-semibold tracking-wider text-[#1A1A1A] hover:text-[#1A3A5C] uppercase whitespace-nowrap transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/search"
                    className="flex items-center gap-1.5 text-xs font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors pl-4 border-l border-[#E0E0E0] shrink-0"
                >
                    <Search className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline uppercase tracking-wider text-[11px]">
                        SEARCH
                    </span>
                </Link>
            </div>
        </nav>
    );
}