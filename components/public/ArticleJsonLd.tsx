import { Post } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sensexnifty.com";
const PUBLISHER_NAME = "SensexNifty";
const PUBLISHER_LOGO = `${SITE_URL}/icon.png`; // optional; replace if you add a logo asset

interface ArticleJsonLdProps {
    post: Post;
    url: string;
}

export default function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
    const author = post.author || {
        name: "The SensexNifty Desk",
        role: "Editorial Desk",
    };

    const published =
        post.publishedAt != null
            ? new Date(post.publishedAt).toISOString()
            : new Date(post.createdAt).toISOString();

    const modified =
        post.updatedAt != null
            ? new Date(post.updatedAt).toISOString()
            : published;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        headline: post.title,
        description: post.summary || post.title,
        image: post.imageUrl ? [post.imageUrl] : undefined,
        datePublished: published,
        dateModified: modified,
        author: {
            "@type": "Person",
            name: author.name,
            jobTitle: author.role || "Financial Journalist",
            url: SITE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: PUBLISHER_NAME,
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: PUBLISHER_LOGO,
            },
        },
        articleSection: post.category,
        keywords: Array.isArray(post.tags) ? post.tags.join(", ") : post.category,
        inLanguage: "en-IN",
        isAccessibleForFree: true,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}