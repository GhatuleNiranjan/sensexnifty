import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#F8F8F8] border-t-2 border-[#1A1A1A] text-[#1A1A1A] font-serif pt-12 pb-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E0E0E0]">
                    {/* Brand Info */}
                    <div className="md:col-span-2 space-y-3">
                        <h2 className="font-serif text-2xl font-black tracking-tight text-[#1A1A1A]">
                            SENSEXNIFTY
                        </h2>
                        <p className="font-serif italic text-xs text-[#6B6B6B]">
                            News Behind The Numbers
                        </p>
                        <p className="font-sans text-xs text-[#6B6B6B] max-w-md leading-relaxed">
                            Independent financial journalism covering markets, geopolitics, and global economies with context, rigor, and clarity.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-2">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                            Coverage Sections
                        </h3>
                        <ul className="font-sans text-xs text-[#6B6B6B] space-y-1.5 uppercase font-medium">
                            {CATEGORIES.map(category => (
                                <li key={category.slug}><Link href={`/${category.slug}`} className="hover:text-[#1A1A1A]">{category.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Editorial Contact */}
                    <div className="space-y-2">
                        <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                            Editorial Desk
                        </h3>
                        <p className="font-sans text-xs text-[#6B6B6B] leading-relaxed">
                            For editorial inquiries or correction requests, contact the desk at:
                        </p>
                        <a
                            href="mailto:sensexnifty501@gmail.com"
                            className="font-sans text-xs font-bold text-[#1A3A5C] hover:underline block pt-1"
                        >
                            sensexnifty501@gmail.com
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-sans font-semibold uppercase tracking-widest text-[#6B6B6B] gap-2">
                    <p>© {new Date().getFullYear()} SensexNifty. All Rights Reserved.</p>
                    <p>Independent Financial Journalism</p>
                </div>
            </div>
        </footer>
    );
}
