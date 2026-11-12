import Link from "next/link";

export default function Masthead() {
    return (
        <header className="bg-white py-6 sm:py-8 border-b border-[#E0E0E0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#6B6B6B] border-b border-[#E0E0E0] pb-2 mb-4">
                    <span>News Behind The Numbers</span>
                    <span>Facts First. Context Always.</span>
                    <span className="hidden sm:inline">Daily Briefing →</span>
                </div>

                <Link href="/" className="inline-block group">
                    <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1A1A1A] uppercase group-hover:opacity-90 transition-opacity">
                        SENSEXNIFTY
                    </h1>
                </Link>

                <p className="font-serif italic text-xs sm:text-sm text-[#6B6B6B] tracking-widest uppercase">
                    News Behind The Numbers
                </p>
            </div>
        </header>
    );
}