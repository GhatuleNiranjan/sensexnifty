"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TipTapEditor from "@/components/admin/TipTapEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import { ArrowLeft, Tag, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

import { CATEGORIES } from "@/lib/constants";

export default function NewArticlePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("FINANCE");
  const [location, setLocation] = useState("NEW DELHI");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isTopStory, setIsTopStory] = useState(false);
  const [isSpotlight, setIsSpotlight] = useState(false);
  const [isOpinion, setIsOpinion] = useState(false);
  const [status, setStatus] = useState("PUBLISHED");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedTags = tagsInput
    .split(",")
    .map((t) => t.trim().replace(/^#/, ""))
    .filter(Boolean)
    .slice(0, 12);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please provide both headline title and body content.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          summary,
          category,
          location,
          imageUrl,
          content,
          tags: parsedTags,
          isTopStory,
          isSpotlight,
          isOpinion,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create article");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E0E0E0]">
        <Link
          href="/admin"
          className="text-xs font-sans font-bold uppercase tracking-widest text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="font-serif italic text-xs text-[#6B6B6B]">
          Drafting New Dispatch
        </span>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#6B1C2A] text-[#6B1C2A] text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logged in Author Auto-Assignment Banner */}
      <div className="mb-8 p-4 bg-white border border-[#E0E0E0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              session?.user?.image ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
            }
            alt={session?.user?.name || "Author DP"}
            className="w-10 h-10 rounded-full object-cover border border-[#E0E0E0]"
          />
          <div>
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1A1A1A]">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Assigned Author: {session?.user?.name || "Loading..."}</span>
            </div>
            <p className="text-[11px] font-sans text-[#6B6B6B]">
              {session?.user?.role || "Editor"} — {session?.user?.email}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider bg-[#F5F5F0] text-[#6B6B6B] px-2.5 py-1 border border-[#E0E0E0]">
          Auto-linked Profile
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title & Slug */}
        <div className="bg-white p-6 border border-[#E0E0E0] space-y-4">
          <div>
            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Headline Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter broadsheet headline..."
              className="w-full text-lg font-serif font-bold p-3 bg-[#F8F8F8] border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-sans p-2.5 bg-[#F8F8F8] border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] uppercase text-[#1A1A1A]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug.toUpperCase()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Dateline Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="MUMBAI, WASHINGTON, etc."
                className="w-full text-xs font-sans p-2.5 bg-[#F8F8F8] border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] uppercase text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Custom URL Slug (Optional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-if-empty"
                className="w-full text-xs font-sans p-2.5 bg-[#F8F8F8] border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
              />
            </div>
          </div>
        </div>

        {/* Summary & Tags */}
        <div className="bg-white p-6 border border-[#E0E0E0] space-y-4">
          <div>
            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Article Deck / Summary
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary deck for homepage cards..."
              className="w-full text-sm font-sans p-3 bg-[#F8F8F8] border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#6B6B6B]" />
              Hashtags / SEO Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="sensex, nifty, Indian Economy, Stock Market, RBI Policy"
              className="w-full text-xs font-sans p-2.5 bg-[#F8F8F8] border border-[#E0E0E0] focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A]"
            />
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {parsedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-sans font-semibold bg-[#F5F5F0] text-[#1A1A1A] border border-[#E0E0E0] px-2 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cloudinary Cover Image */}
        <div className="bg-white p-6 border border-[#E0E0E0]">
          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">
            Cover Image Upload
          </label>
          <ImageUpload value={imageUrl} onChange={(url) => setImageUrl(url)} />
        </div>

        {/* TipTap Rich Text Editor */}
        <div className="bg-white p-6 border border-[#E0E0E0]">
          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] mb-3">
            Article Content *
          </label>
          <TipTapEditor content={content} onChange={(html) => setContent(html)} />
        </div>

        {/* Visibility Flags */}
        <div className="bg-white p-6 border border-[#E0E0E0] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isTopStory}
              onChange={(e) => setIsTopStory(e.target.checked)}
              className="w-4 h-4 accent-[#1A1A1A]"
            />
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
              Homepage Top Story
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isSpotlight}
              onChange={(e) => setIsSpotlight(e.target.checked)}
              className="w-4 h-4 accent-[#1A1A1A]"
            />
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
              Secondary Spotlight Grid
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isOpinion}
              onChange={(e) => setIsOpinion(e.target.checked)}
              className="w-4 h-4 accent-[#1A1A1A]"
            />
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
              Opinion / Column
            </span>
          </label>
        </div>

        {/* Status & Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E0E0E0]">
          <div className="flex items-center gap-3">
            <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
              Publish Status:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-xs font-sans font-semibold p-2 bg-white border border-[#E0E0E0] uppercase"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-sans font-bold uppercase tracking-widest py-3 px-8 transition-colors disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
