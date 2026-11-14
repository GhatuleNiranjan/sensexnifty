import { getPostBySlug } from "@/lib/posts";
import { optimizeArticleImages } from "@/lib/article-images";
import { notFound } from "next/navigation";
import Image from "next/image";
import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import CategoryNav from "@/components/public/CategoryNav";
import EditionStrip from "@/components/public/EditionStrip";
import Footer from "@/components/public/Footer";
import ShareButtons from "@/components/public/ShareButtons"; // <-- Import
import { Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

// Build article pages on first visit, then reuse them until content changes.
export const revalidate = 60;
export async function generateStaticParams() { return []; }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | SensexNifty" };
  }

  const tagKeywords = post.tags || [];

  return {
    title: `${post.title} | SensexNifty`,
    description: post.summary,
    keywords: tagKeywords.length > 0 ? tagKeywords : [post.category, "SensexNifty", "Finance"],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `https://sensexnifty.com/${post.category.toLowerCase()}/${post.slug}`,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : null;

  const author = post.author || {
    name: "The SensexNifty Desk",
    role: "Editorial Desk",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    bio: "Independent financial journalism covering markets, geopolitics, and global economies.",
  };

  // Construct absolute URL for sharing
  const articleUrl = `https://sensexnifty.com/${category.toLowerCase()}/${slug}`;

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-serif">
      <TopBar />
      <Masthead />
      <CategoryNav />
      <EditionStrip />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <article className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-[#6B6B6B] border-b border-[#E0E0E0] pb-3">
            <span className="text-[#1A3A5C]">{post.category}</span>
            {post.location && (
              <>
                <span>•</span>
                <span>{post.location}</span>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.12] tracking-tight text-[#1A1A1A]">
            {post.title}
          </h1>

          {post.summary && (
            <p className="font-serif italic text-lg sm:text-xl text-[#6B6B6B] leading-relaxed border-l-2 border-[#1A1A1A] pl-4 py-1">
              {post.summary}
            </p>
          )}

          <div className="border-y border-[#E0E0E0] py-4 my-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={author.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                  alt={author.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E0E0E0]"
                />
                <div>
                  <p className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">{author.name}</p>
                  <p className="text-[11px] font-sans text-[#6B6B6B]">{author.role || "Financial Journalist"}</p>
                </div>
              </div>

              {publishedDate && (
                <div className="text-right">
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">Published</p>
                  <p className="text-xs font-sans text-[#1A1A1A] font-medium">{publishedDate}</p>
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {post.imageUrl && (
            <div className="my-6">
              <div className="relative aspect-[16/9] w-full border border-[#E0E0E0] overflow-hidden bg-[#F8F8F8]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 900px"
                />
              </div>
            </div>
          )}

          <div
            className="article-body prose prose-lg max-w-none text-[#1A1A1A] font-serif leading-relaxed space-y-4 pt-4 text-justify sm:text-left [&_[data-align='left']]:float-left [&_[data-align='left']]:mr-6 [&_[data-align='left']]:mb-4 [&_[data-align='right']]:float-right [&_[data-align='right']]:ml-6 [&_[data-align='right']]:mb-4 [&_[data-align='center']]:block [&_[data-align='center']]:mx-auto [&_[data-align='center']]:my-6 [&_img]:rounded-none [&_img]:border [&_img]:border-[#E0E0E0]"
            dangerouslySetInnerHTML={{ __html: optimizeArticleImages(post.content) }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 mt-10 border-t border-[#E0E0E0]">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#1A3A5C]" />
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Related Topics & SEO Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={`/search?tag=${encodeURIComponent(tag)}`}
                    className="text-xs font-sans font-medium text-[#1A3A5C] bg-[#F5F5F0] border border-[#E0E0E0] px-3 py-1 hover:bg-[#E0E0E0] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 p-6 bg-[#F8F8F8] border border-[#E0E0E0] flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={author.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#1A1A1A] shrink-0"
            />
            <div className="space-y-1.5">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">About The Author</span>
              <h3 className="font-serif text-lg font-extrabold text-[#1A1A1A]">{author.name}</h3>
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-[#1A3A5C]">{author.role || "Financial Journalist"}</p>
              <p className="text-xs font-sans text-[#6B6B6B] leading-relaxed pt-1">{author.bio || "Senior Editor covering markets, financial policy, and global geopolitical movements for SensexNifty."}</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#F5F5F0] border-l-2 border-[#1A1A1A] text-xs font-sans text-[#6B6B6B] leading-relaxed italic">
            <strong>Disclaimer:</strong> This article is published for informational and educational purposes only. Market analyses and opinions expressed do not constitute financial advice or investment recommendations. Always consult a certified financial advisor before making market decisions.
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
