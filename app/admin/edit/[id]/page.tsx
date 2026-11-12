"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TipTapEditor from "@/components/admin/TipTapEditor";
import { CATEGORIES } from "@/lib/constants";

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
    const { id } = use(params);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("FINANCE");
    const [location, setLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageCaption, setImageCaption] = useState("");
    const [content, setContent] = useState("");
    const [isTopStory, setIsTopStory] = useState(false);
    const [tags, setTags] = useState("");

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/${id}`);
                if (!res.ok) throw new Error("Failed to fetch post");
                const data = await res.json();
                setTitle(data.title || "");
                setSummary(data.summary || "");
                setCategory(data.category || "FINANCE");
                setLocation(data.location || "");
                setImageUrl(data.imageUrl || "");
                setImageCaption(data.imageCaption || "");
                setContent(data.content || "");
                setIsTopStory(Boolean(data.isTopStory));
                setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
            } catch (err: unknown) {
                setError((err instanceof Error ? err.message : "") || "Failed to load article");
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Image upload failed.");
            setImageUrl(data.url);
        } catch (err: unknown) {
            alert((err instanceof Error ? err.message : "") || "Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    summary,
                    category,
                    location,
                    imageUrl,
                    imageCaption,
                    content,
                    isTopStory,
                    tags,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update article.");
            }

            router.push("/admin");
            router.refresh();
        } catch (err: unknown) {
            setError((err instanceof Error ? err.message : "") || "Failed to update article.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-8 font-serif text-center text-[#6B6B6B]">
                Loading article for editing...
            </div>
        );
    }

    const tagPreview = tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 font-serif">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E0E0E0]">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">Edit Article</h1>
                    <p className="text-xs font-sans text-[#6B6B6B] mt-1">
                        Modify fields and save changes back to the newspaper edition.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-xs font-sans font-bold border border-[#E0E0E0] text-[#1A1A1A] hover:bg-gray-100 uppercase"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-2">
                        Headline / Title *
                    </label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-[#E0E0E0] focus:border-[#1A3A5C] outline-none font-serif text-lg"
                    />
                </div>

                <div>
                    <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-2">
                        Summary / Deck
                    </label>
                    <input
                        type="text"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Short summarizing line below headline..."
                        className="w-full p-3 border border-[#E0E0E0] focus:border-[#1A3A5C] outline-none font-serif text-base"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-2">
                            Category *
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 border border-[#E0E0E0] focus:border-[#1A3A5C] outline-none font-sans text-sm bg-white uppercase"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.slug} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-3 border border-[#E0E0E0] focus:border-[#1A3A5C] outline-none font-sans text-sm uppercase"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-2">
                        Hashtags / SEO Tags
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g. Russia, Europe, Markets, Sensex"
                        className="w-full p-3 border border-[#E0E0E0] focus:border-[#1A3A5C] outline-none font-sans text-sm"
                    />
                    <p className="mt-1 text-[10px] font-sans text-[#6B6B6B] uppercase tracking-wider">
                        Comma-separated. Max 12 tags.
                    </p>
                    {tagPreview.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {tagPreview.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#E0E0E0] bg-[#F8F8F8] text-[#1A3A5C]"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border border-[#E0E0E0] p-4 bg-[#F8F8F8]">
                    <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-2">
                        Featured Image
                    </label>

                    {imageUrl ? (
                        <div className="space-y-3">
                            <div className="relative aspect-[16/9] bg-white border border-[#E0E0E0] overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt="Cover Preview"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 700px"
                                    className="object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="px-3 py-1.5 text-xs font-sans text-red-600 border border-red-300 bg-white hover:bg-red-50 uppercase font-semibold"
                            >
                                Remove Image
                            </button>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="block w-full text-xs font-sans text-[#6B6B6B] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#1A3A5C] file:text-white hover:file:bg-[#142d48] cursor-pointer"
                            />
                            {uploading && (
                                <p className="text-xs font-sans text-[#1A3A5C] mt-2">
                                    Uploading to Cloudinary...
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-4">
                        <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-1">
                            Image Caption / Credit
                        </label>
                        <input
                            type="text"
                            value={imageCaption}
                            onChange={(e) => setImageCaption(e.target.value)}
                            placeholder="e.g. PHOTO: REUTERS / JOHN DOE"
                            className="w-full p-2.5 border border-[#E0E0E0] focus:border-[#1A3A5C] outline-none font-sans text-xs bg-white"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isTopStory"
                        checked={isTopStory}
                        onChange={(e) => setIsTopStory(e.target.checked)}
                        className="w-4 h-4 text-[#1A3A5C] border-[#E0E0E0] rounded focus:ring-0"
                    />
                    <label
                        htmlFor="isTopStory"
                        className="text-xs font-sans font-bold text-[#1A1A1A] uppercase cursor-pointer"
                    >
                        Mark as Homepage Top Story
                    </label>
                </div>

                <div>
                    <label className="block text-xs font-sans font-bold text-[#1A1A1A] uppercase mb-2">
                        Full Article Content *
                    </label>
                    <TipTapEditor value={content} onChange={(html) => setContent(html)} />
                </div>

                <div className="pt-4 border-t border-[#E0E0E0] flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-[#1A3A5C] text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#142d48] transition-colors disabled:opacity-50"
                    >
                        {saving ? "SAVING CHANGES..." : "UPDATE ARTICLE"}
                    </button>
                </div>
            </form>
        </div>
    );
}