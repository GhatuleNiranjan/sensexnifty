// app/(public)/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';

import TopBar from '@/components/public/TopBar';
import Masthead from '@/components/public/Masthead';
import CategoryNav from '@/components/public/CategoryNav';
import Footer from '@/components/public/Footer';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    select: { title: true, summary: true, imageUrl: true },
  });

  if (!post) return { title: 'Article Not Found' };

  return {
    title: post.title,
    description: post.summary || post.title,
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params;

  const post = await db.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post || !post.publishedAt) {
    notFound();
  }

  // Word count & read time calculation (200 wpm)
  const plainText = post.content ? post.content.replace(/<[^>]*>/g, '') : '';
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const postUrl = `https://www.sensexnifty.com/${category.toLowerCase()}/${post.slug}`;

  // Structured Data for Google News
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.summary || post.title,
    image: post.imageUrl ? [post.imageUrl] : [],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: [
      {
        '@type': 'Person',
        name: post.author?.name || 'SensexNifty Editorial Board',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'SensexNifty',
      url: 'https://www.sensexnifty.com',
    },
  };

  return (
    <>
      {/* Structured Schema for Google News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen flex flex-col bg-white">
        {/* TOP BAR */}
        <TopBar />

        {/* BROADSHEET MASTHEAD */}
        <Masthead />

        {/* NAVIGATION BAR */}
        <CategoryNav activeCategory={category.toUpperCase()} />

        {/* ARTICLE CONTENT */}
        <main className="flex-grow pb-20">
          <article>
            {/* Header */}
            <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-8 text-center">
              <Link
                href={`/${post.category.toLowerCase()}`}
                className="inline-block text-[#1A3A5C] font-sans text-xs font-black uppercase tracking-[0.2em] mb-6 hover:text-[#0056b3] transition-colors"
              >
                {post.category}
              </Link>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-[1.12] tracking-tight mb-6">
                {post.title}
              </h1>

              {post.summary && (
                <p className="font-serif text-lg md:text-xl text-[#6B6B6B] italic leading-relaxed max-w-3xl mx-auto">
                  {post.summary}
                </p>
              )}
            </header>

            {/* Author Meta & Share Bar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-y border-[#E0E0E0] mb-10">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[11px] md:text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4 md:mb-0">
                  <span>By {post.author?.name || 'Editorial Team'}</span>
                  <span className="text-[#E0E0E0] hidden sm:inline">•</span>
                  <time className="text-[#6B6B6B]">{formattedDate}</time>
                  <span className="text-[#E0E0E0] hidden sm:inline">•</span>
                  <span className="text-[#6B6B6B]">{readTime} MIN READ</span>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-sans font-bold text-[#6B6B6B] uppercase tracking-widest mr-1">
                    Share
                  </span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F5F0] text-[#1A1A1A] hover:bg-[#1A3A5C] hover:text-white transition-colors border border-[#E0E0E0]"
                    aria-label="Share on X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F5F0] text-[#1A1A1A] hover:bg-[#1A3A5C] hover:text-white transition-colors border border-[#E0E0E0]"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Hero Cover Image */}
            {post.imageUrl && (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="relative w-full aspect-[16/9] overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8]">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                </div>
              </div>
            )}

            {/* Main Rich Text Article Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="article-body font-serif text-[18px] md:text-[20px] leading-[1.8] text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Hashtags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#E0E0E0] flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-sans font-bold text-[#1A1A1A] uppercase tracking-widest mr-2">
                    TAGS:
                  </span>
                  {post.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag.replace('#', ''))}`}
                      className="text-xs font-sans bg-[#F5F5F0] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white px-3 py-1.5 transition-colors font-medium border border-[#E0E0E0]"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        </main>

        {/* BROADSHEET FOOTER */}
        <Footer />
      </div>
    </>
  );
}