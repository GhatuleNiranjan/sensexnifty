"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { SITE_CONFIG } from "@/lib/constants";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        await signIn("email", {
            email,
            callbackUrl: "/admin",
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h1 className="text-4xl font-masthead font-black uppercase text-[#1A1A1A]">
                    {SITE_CONFIG.name}
                </h1>
                <h2 className="mt-4 text-center text-sm font-bold tracking-widest text-[#6B6B6B] uppercase">
                    Editorial Desk Login
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow border border-[#E0E0E0] sm:rounded-none sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                                Authorized Email Address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-[#E0E0E0] bg-[#F8F8F8] placeholder-[#6B6B6B] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A3A5C] focus:border-[#1A3A5C] sm:text-sm transition-colors"
                                    placeholder="editor@sensexnifty.com"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-[#1A1A1A] hover:bg-[#1A3A5C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A3A5C] transition-colors disabled:opacity-50"
                            >
                                {loading ? "Sending Link..." : "Send Magic Link"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}