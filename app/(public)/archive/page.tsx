import { categoryName } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import CategoryNav from "@/components/public/CategoryNav";
import EditionStrip from "@/components/public/EditionStrip";
import Footer from "@/components/public/Footer";
import { getArchiveTree, getArchivePosts } from "@/lib/posts";
import { Calendar, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
    title: "Historical Archive | SensexNifty",
    description:
        "Explore the complete chronological archive of dispatches, financial reports, and geopolitical analyses published on SensexNifty.",
};

export default async function ArchiveIndexPage() {
    const [archiveTree, allArchivedPosts] = await Promise.all([
        getArchiveTree(),
        getArchivePosts({ limit: 50 }),
    ]);

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-serif">
            <TopBar />
            <Masthead />
            <CategoryNav />
            <EditionStrip />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Archive Title */}
                <div className="pb-6 mb-8 border-b-2 border-[#1A1A1A] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.25em] text-[#6B6B6B]">
                            SensexNifty Historical Records
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
                            Newspaper Archive
                        </h1>
                    </div>
                    <p className="text-xs font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                        {allArchivedPosts.length} Published Dispatches Logged
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Timeline Navigation Tree */}
                    <div className="lg:col-span-4 bg-[#F8F8F8] border border-[#E0E0E0] p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-[#E0E0E0]">
                            <Calendar className="w-4 h-4 text-[#1A3A5C]" />
                            <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                                Archive Timeline
                            </h2>
                        </div>

                        {archiveTree.length === 0 ? (
                            <p className="text-xs font-sans text-[#6B6B6B] italic">
                                No archived dispatches logged yet.
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {archiveTree.map(({ year, months }) => (
                                    <div key={year} className="space-y-2">
                                        <div className="text-sm font-sans font-extrabold text-[#1A1A1A] border-b border-[#E0E0E0] pb-1">
                                            {year}
                                        </div>
                                        <ul className="space-y-1.5 pl-2">
                                            {months.map(({ monthNumber, monthName, count }) => (
                                                <li key={monthNumber}>
                                                    <Link
                                                        href={`/archive/${year}/${monthNumber}`}
                                                        className="text-xs font-sans font-medium text-[#1A3A5C] hover:text-[#1A1A1A] hover:underline flex items-center justify-between group py-1"
                                                    >
                                                        <span className="flex items-center gap-1.5">
                                                            <ChevronRight className="w-3 h-3 text-[#6B6B6B] group-hover:translate-x-0.5 transition-transform" />
                                                            {monthName} {year}
                                                        </span>
                                                        <span className="text-[10px] font-sans font-semibold text-[#6B6B6B] bg-white border border-[#E0E0E0] px-2 py-0.5">
                                                            {count}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Complete Archive Feed */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="pb-3 border-b border-[#E0E0E0]">
                            <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                                Chronological Feed
                            </h2>
                        </div>

                        {allArchivedPosts.length === 0 ? (
                            <div className="p-12 text-center bg-[#F8F8F8] border border-[#E0E0E0]">
                                <p className="font-serif italic text-base text-[#6B6B6B]">
                                    No archived articles available.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allArchivedPosts.map((post) => {
                                    const author = post.author || {
                                        name: "The SensexNifty Desk",
                                        image:
                                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
                                    };

                                    const publishedDate = post.publishedAt
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
                                                    <span className="text-[#1A3A5C]">{categoryName(post.category)}</span>
                                                    {post.location && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{post.location}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <Link href={`/${post.category.toLowerCase()}/${post.slug}`}>
                                                    <h3 className="font-serif text-base font-bold text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#1A3A5C] transition-colors">
                                                        {post.title}
                                                    </h3>
                                                </Link>

                                                {post.summary && (
                                                    <p className="font-sans text-xs text-[#6B6B6B] line-clamp-3 leading-relaxed">
                                                        {post.summary}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-5 pt-3 border-t border-[#E0E0E0] flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#6B6B6B]">
                                                <div className="flex items-center gap-2 truncate max-w-[150px]">
                                                    <img
                                                        src={
                                                            author.image ||
                                                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                                                        }
                                                        alt={author.name}
                                                        className="w-4 h-4 rounded-full object-cover shrink-0"
                                                    />
                                                    <span className="truncate text-[#1A1A1A]">
                                                        {author.name}
                                                    </span>
                                                </div>
                                                <span>{publishedDate}</span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
