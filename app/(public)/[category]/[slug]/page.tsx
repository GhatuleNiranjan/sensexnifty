// app/(public)/[category]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';

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

  // Check if article exists and is published
  if (!post || !post.publishedAt) {
    notFound();
  }

  // Word count & read time calculation (approx 200 words per minute)
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
      {/* Google News Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          {/* Category Badge & Headline */}
          <div className="border-b border-[#E0E0E0] pb-6 mb-8 text-center sm:text-left">
            <div className="inline-block bg-[#1A3A5C] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4">
              {post.category}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-[1.15] mb-4">
              {post.title}
            </h1>

            {post.summary && (
              <p className="font-serif text-lg sm:text-xl text-[#6B6B6B] italic mb-6 leading-relaxed">
                {post.summary}
              </p>
            )}

            {/* Author Metadata & Social Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E0E0E0]/60 text-xs font-sans text-[#6B6B6B] uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-[#1A1A1A]">
                  By {post.author?.name || 'Editorial Team'}
                </span>
                <span>•</span>
                <time>{formattedDate}</time>
                <span>•</span>
                <span>{readTime} MIN READ</span>
              </div>

              {/* Inline SVG Social Share Buttons */}
              <div className="flex items-center space-x-3">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1A3A5C] transition-colors"
                  aria-label="Share on X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1A3A5C] transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          {post.imageUrl && (
            <div className="mb-10 overflow-hidden border border-[#E0E0E0]">
              <div className="relative w-full aspect-[16/9]">
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

          {/* Full Rich Text Article Content */}
          <div
            className="article-body font-serif text-[18px] leading-[1.8] text-[#1A1A1A]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tag Chips */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-[#E0E0E0] flex flex-wrap gap-2">
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
        </article>
      </main>
    </>
  );
}