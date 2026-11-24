import Link from "next/link";
import Image from "next/image";
import StockTicker from './StockTicker';

export default function Masthead() {
    return (
        <>
        {/* React hoists this async script into the document head and deduplicates it. */}
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7407357339041411"
            crossOrigin="anonymous"
        />
        <header className="bg-white py-6 sm:py-8 border-b border-[#E0E0E0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#6B6B6B] border-b border-[#E0E0E0] pb-2 mb-4">
                    <span>News Behind The Numbers</span>
                    <span>Facts First. Context Always.</span>
                    <span className="hidden sm:inline">Daily Briefing →</span>
                </div>

                <Link href="/" className="inline-block group">
                    <Image
                        src="/sensexnifty-logo.avif"
                        alt="SensexNifty - Global Markets, Geopolitics, Economy"
                        width={768}
                        height={512}
                        priority
                        className="h-auto w-[min(78vw,34rem)] group-hover:opacity-90 transition-opacity"
                    />
                </Link>
            </div>
        </header><StockTicker /></>
    );
}
