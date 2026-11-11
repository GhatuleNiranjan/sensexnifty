import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function Masthead() {
    return (
        <header className="py-8 text-center border-b border-[#E0E0E0] bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <Link href="/" className="inline-block">
                    <h1
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#1A1A1A] uppercase"
                        style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            transform: "scaleY(1.05)",
                        }}
                    >
                        {SITE_CONFIG.name}
                    </h1>
                </Link>
                <p className="mt-2 text-xs md:text-sm tracking-[0.25em] text-[#6B6B6B] uppercase font-medium">
                    {SITE_CONFIG.tagline}
                </p>
            </div>
        </header>
    );
}