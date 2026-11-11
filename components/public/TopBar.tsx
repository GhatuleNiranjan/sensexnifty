import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function TopBar() {
    return (
        <div className="w-full bg-[#F5F5F0] border-b border-[#E0E0E0] py-2 px-4 text-[11px] tracking-widest text-[#6B6B6B] uppercase">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
                <span className="font-medium hidden sm:inline">
                    {SITE_CONFIG.tagline}
                </span>
                <span className="font-semibold text-[#1A1A1A]">
                    {SITE_CONFIG.slogan2}
                </span>
                <Link
                    href="/archive"
                    className="hover:text-[#1A3A5C] transition-colors underline underline-offset-2 font-medium whitespace-nowrap"
                >
                    DAILY BRIEFING →
                </Link>
            </div>
        </div>
    );
}