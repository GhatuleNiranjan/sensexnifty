"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import { ArrowLeft, User, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setImage(session.user.image || "");
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            // Tell NextAuth to update the session cookie with new data
            await update({
                name: data.user.name,
                image: data.user.image,
            });

            setSuccess("Profile updated successfully!");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E0E0E0]">
                <Link
                    href="/admin"
                    className="text-xs font-sans font-bold uppercase tracking-widest text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <span className="font-serif italic text-xs text-[#6B6B6B]">
                    Profile Settings
                </span>
            </div>

            <div className="bg-white border border-[#E0E0E0] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E0E0E0]">
                    <User className="w-6 h-6 text-[#1A1A1A]" />
                    <h1 className="font-serif text-2xl font-extrabold text-[#1A1A1A]">
                        Edit Author Profile
                    </h1>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#6B1C2A] text-[#6B1C2A] text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-700 text-emerald-800 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                            Author Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-sm font-sans p-3 bg-[#F8F8F8] border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">
                            Profile Picture (DP)
                        </label>
                        <div className="max-w-sm">
                            <ImageUpload value={image} onChange={(url) => setImage(url)} />
                        </div>
                        <p className="text-[11px] font-sans text-[#6B6B6B] mt-2">
                            For best results, upload a square image.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-[#E0E0E0]">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-sans font-bold uppercase tracking-widest py-3 px-8 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Saving Changes..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}