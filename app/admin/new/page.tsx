"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TipTapEditor from "@/components/admin/TipTapEditor";
import { CATEGORIES } from "@/lib/constants";
import { Upload, ArrowLeft, Send } from "lucide-react";

export default function NewPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("FINANCE");
    const [location, setLocation] = useState("MUMBAI");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageCaption, setImageCaption] = useState("");
    const [isTopStory, setIsTopStory] = useState(false);
    const [tags, setTags] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.url) {
                setImageUrl(data.url);
            } else {
                alert("Image upload failed. Check Cloudinary settings.");
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading file.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent, status: "PUBLISHED" | "DRAFT") => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    location,
                    summary,
                    content,
                    imageUrl,
                    imageCaption,
                    isTopStory,
                    status,
                    tags,
                }),
            });

            if (res.ok) {
                alert(status === "DRAFT" ? "Draft saved." : "Post published successfully!");
                router.push("/admin");
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.error || "Failed to publish post.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const tagPreview = tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

    return (
        <div className="max-w-4xl mx-auto pb-16 font-sans">
            <div className="flex items-center justify-between border-b border-[#E0E0E0] pb-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-xs font-bold text-[#6B6B6B] hover:text-[#1A1A1A] uppercase tracking-wider transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                <h1 className="text-xl font-headline font-black text-[#1A1A1A] uppercase">
                    Create New Article
                </h1>
            </div>

            <form onSubmit={(e) => handleSubmit(e, "PUBLISHED")} className="space-y-8">
                <div className="bg-white border border-[#E0E0E0] p-6">
                    <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                        1. Cover Image (Auto-Fits Newspaper Cards & Hero)
                    </label>

                    {imageUrl ? (
                        <div className="relative aspect-[16/9] bg-[#F5F5F0] border border-[#E0E0E0] overflow-hidden mb-4">
                            <Image
                                src={imageUrl}
                                alt="Cover Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, 896px"
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="absolute top-2 right-2 bg-black/80 text-white text-xs px-3 py-1 font-bold uppercase cursor-pointer"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-[#E0E0E0] bg-[#F8F8F8] p-8 text-center">
                            <Upload className="w-8 h-8 text-[#A0A0A0] mx-auto mb-2" />
                            <p className="text-xs text-[#6B6B6B] uppercase tracking-wider font-semibold mb-3">
                                {uploadingImage
                                    ? "Uploading to Cloud..."
                                    : "Drag & drop cover image or click to browse"}
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="block mx-auto text-xs text-[#6B6B6B] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#1A1A1A] file:text-white hover:file:bg-[#1A3A5C] cursor-pointer"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase mb-1">
                                Photo Caption / Credit:
                            </label>
                            <input
                                type="text"
                                value={imageCaption}
                                onChange={(e) => setImageCaption(e.target.value)}
                                placeholder="Photo: Reuters / SensexNifty"
                                className="w-full text-xs p-2 border border-[#E0E0E0] bg-[#F8F8F8] focus:outline-none focus:border-[#1A3A5C]"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#E0E0E0] p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                            2. Headline / Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Goldman Sachs Upgrades Indian Banking Sector Target Prices"
                            className="w-full text-lg font-headline font-bold p-3 border border-[#E0E0E0] bg-[#F8F8F8] text-[#1A1A1A] focus:outline-none focus:border-[#1A3A5C]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                                Category *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full text-xs font-bold p-3 border border-[#E0E0E0] bg-[#F8F8F8] text-[#1A1A1A] focus:outline-none focus:border-[#1A3A5C] uppercase"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.slug} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="MUMBAI"
                                className="w-full text-xs p-3 border border-[#E0E0E0] bg-[#F8F8F8] text-[#1A1A1A] focus:outline-none focus:border-[#1A3A5C] uppercase"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                            3. Summary / Lead Story *
                        </label>
                        <textarea
                            rows={4}
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="A brief summary that will be shown in the card view and RSS feed..."
                            className="w-full text-sm p-3 border border-[#E0E0E0] bg-[#F8F8F8] text-[#1A1A1A] focus:outline-none focus:border-[#1A3A5C]"
                        />
                    </div>

                    {/* Phase 2: Tags */}
                    <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                            4. Hashtags / SEO Tags
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="e.g. Russia, Europe, Markets, Sensex, Nifty"
                            className="w-full text-sm p-3 border border-[#E0E0E0] bg-[#F8F8F8] text-[#1A1A1A] focus:outline-none focus:border-[#1A3A5C]"
                        />
                        <p className="mt-1.5 text-[10px] text-[#6B6B6B] uppercase tracking-wider">
                            Comma-separated. Used for SEO reach and article tag pills. Max 12.
                        </p>
                        {tagPreview.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {tagPreview.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#E0E0E0] bg-white text-[#1A3A5C]"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-[#E0E0E0] p-6">
                    <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                        5. Full Article Content *
                    </label>
                    <TipTapEditor value={content} onChange={setContent} />
                </div>

                <div className="bg-white border border-[#E0E0E0] p-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isTopStory}
                            onChange={(e) => setIsTopStory(e.target.checked)}
                            className="w-5 h-5"
                        />
                        <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                            Mark as Featured Top Story
                        </span>
                    </label>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, "DRAFT")}
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-[#6B1C2A] hover:bg-[#4A141D] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow"
                        >
                            <span>Save as Draft</span>
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-[#1A3A5C] hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow"
                        >
                            <Send className="w-4 h-4" />
                            <span>{loading ? "Publishing..." : "PUBLISH ARTICLE NOW"}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}