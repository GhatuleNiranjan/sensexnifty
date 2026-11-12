"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error || "Invalid login details.");
                setLoading(false);
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F0] flex flex-col justify-center items-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-[#E0E0E0] shadow-sm p-8">
                {/* Masthead Header */}
                <div className="text-center mb-8 pb-6 border-b border-[#E0E0E0]">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-[#6B6B6B]">
                        Editorial Control Portal
                    </span>
                    <h1 className="font-serif text-3xl font-extrabold tracking-tight text-[#1A1A1A] mt-1">
                        SENSEXNIFTY
                    </h1>
                    <p className="font-serif italic text-xs text-[#6B6B6B] mt-1">
                        News Behind The Numbers
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border-l-4 border-[#6B1C2A] text-[#6B1C2A] text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                            Author Email
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-3 text-[#6B6B6B]" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="niranjanghatule17@gmail.com"
                                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F8F8F8] border border-[#E0E0E0] rounded-none focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 absolute left-3 top-3 text-[#6B6B6B]" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F8F8F8] border border-[#E0E0E0] rounded-none focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-sans font-bold uppercase tracking-widest py-3 px-4 transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                        {loading ? (
                            "Authenticating..."
                        ) : (
                            <>
                                Sign In To Desk <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-4 border-t border-[#E0E0E0] text-center">
                    <Link
                        href="/"
                        className="text-xs font-sans text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                    >
                        ← Return to Public Newspaper
                    </Link>
                </div>
            </div>
        </div>
    );
}