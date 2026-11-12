import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import CategoryNav from "@/components/public/CategoryNav";
import EditionStrip from "@/components/public/EditionStrip";
import Footer from "@/components/public/Footer";
import SearchBar from "@/components/public/SearchBar";
import { searchPosts, getPostsByTag } from "@/lib/posts";
import { Post } from "@/types";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; tag?: string }>;
}): Promise<Metadata> {
    const { q, tag } = await searchParams;
    if (tag) {
        return {
            title: `#${tag} — SensexNifty Search`,
            description: `Articles tagged #${tag} on SensexNifty.`,
        };
    }
    if (q) {
        return {
            title: `"${q}" — SensexNifty Search`,
            description: `Search results for ${q} on SensexNifty.`,
        };
    }
    return {
        title: "Search | SensexNifty",
        description: "Search SensexNifty markets, geopolitics, and opinion coverage.",
    };
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; tag?: string }>;
}) {
    const { q, tag } = await searchParams;
    const query = (q || "").trim();
    const tagQuery = (tag || "").trim().replace(/^#/, "");

    let posts: Post[] = [];
    let mode: "empty" | "query" | "tag" = "empty";

    if (tagQuery) {
        posts = await getPostsByTag(tagQuery, 40);
        mode = "tag";
    } else if (query) {
        posts = await searchPosts(query, 40);
        mode = "query";
    }

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-serif">
            <TopBar />
            <Masthead />
            <CategoryNav />
            <EditionStrip />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="pb-6 mb-8 border-b-2 border-[#1A1A1A] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.25em] text-[#6B6B6B]">
                                Desk Search
                            </span>
                            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-[#1A1A1A]">
                                {mode === "tag"
                                    ? `Tag: #${tagQuery}`
                                    : mode === "query"
                                        ? `Results for “${query}”`
                                        : "Search the Archive"}
                            </h1>
                        </div>
                        <p className="text-xs font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                            {mode === "empty"
                                ? "Enter a keyword or tag"
                                : `${posts.length} dispatch${posts.length === 1 ? "" : "es"} found`}
                        </p>
                    </div>

                    <SearchBar variant="page" initialQuery={query || (tagQuery ? `#${tagQuery}` : "")} />
                </div>

                {mode === "empty" && (
                    <div className="p-12 text-center bg-[#F8F8F8] border border-[#E0E0E0]">
                        <p className="font-serif italic text-base text-[#6B6B6B] mb-2">
                            Search headlines, body text, authors, categories, or hashtags.
                        </p>
                        <p className="text-xs font-sans text-[#6B6B6B]">
                            Examples: <span className="font-semibold text-[#1A1A1A]">Nifty</span>,{" "}
                            <span className="font-semibold text-[#1A1A1A]">Fed</span>,{" "}
                            <span className="font-semibold text-[#1A1A1A]">#sensex</span>
                        </p>
                    </div>
                )}

                {mode !== "empty" && posts.length === 0 && (
                    <div className="p-12 text-center bg-[#F8F8F8] border border-[#E0E0E0]">
                        <p className="font-serif italic text-base text-[#6B6B6B]">
                            No published dispatches matched your search.
                        </p>
                        <Link
                            href="/"
                            className="inline-block mt-4 text-xs font-sans font-bold uppercase tracking-widest text-[#1A3A5C] hover:underline"
                        >
                            ← Return to homepage
                        </Link>
                    </div>
                )}

                {posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => {
                            const author = post.author || {
                                name: "The SensexNifty Desk",
                                image:
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
                            };

                            const publishedTime = post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                : "TODAY";

                            return (
                                <article
                                    key={post.id}
                                    className="p-5 bg-white border border-[#E0E0E0] flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
                                >
                                    <div className="space-y-3">
                                        {post.imageUrl && (
                                            <Link
                                                href={`/${post.category.toLowerCase()}/${post.slug}`}
                                                className="block overflow-hidden border border-[#E0E0E0]"
                                            >
                                                <div className="relative aspect-[16/9] w-full bg-[#F8F8F8]">
                                                    <Image
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover hover:scale-[1.01] transition-transform duration-300"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                </div>
                                            </Link>
                                        )}

                                        <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                                            <span className="text-[#1A3A5C]">{post.category}</span>
                                            {post.location && (
                                                <>
                                                    <span>•</span>
                                                    <span>{post.location}</span>
                                                </>
                                            )}
                                        </div>

                                        <Link href={`/${post.category.toLowerCase()}/${post.slug}`}>
                                            <h2 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug hover:text-[#1A3A5C] transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        {post.summary && (
                                            <p className="font-sans text-xs text-[#6B6B6B] line-clamp-3 leading-relaxed">
                                                {post.summary}
                                            </p>
                                        )}

                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {post.tags.slice(0, 4).map((t: string) => (
                                                    <Link
                                                        key={t}
                                                        href={`/search?tag=${encodeURIComponent(t)}`}
                                                        className="text-[10px] font-sans font-semibold text-[#1A3A5C] bg-[#F5F5F0] border border-[#E0E0E0] px-2 py-0.5 hover:bg-[#E0E0E0] transition-colors"
                                                    >
                                                        #{t}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 pt-3 border-t border-[#E0E0E0] flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#6B6B6B]">
                                        <div className="flex items-center gap-2 truncate max-w-[160px]">
                                            <img
                                                src={
                                                    author.image ||
                                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                                                }
                                                alt={author.name}
                                                className="w-4 h-4 rounded-full object-cover shrink-0"
                                            />
                                            <span className="truncate text-[#1A1A1A]">{author.name}</span>
                                        </div>
                                        <span>{publishedTime}</span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}