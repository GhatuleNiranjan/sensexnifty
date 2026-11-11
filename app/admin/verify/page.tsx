import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-12 px-4 shadow border border-[#E0E0E0] sm:rounded-none sm:px-10 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#e8f0fe] mb-4">
                        <svg className="h-6 w-6 text-[#1A3A5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-headline font-bold text-[#1A1A1A] mb-2">Check your email</h2>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
                        A secure sign-in link has been sent to your email address. Click the link to access the {SITE_CONFIG.name} editorial dashboard.
                    </p>
                    <Link href="/" className="text-xs font-bold text-[#1A3A5C] uppercase tracking-wider hover:underline">
                        ← Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}