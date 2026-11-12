import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sensexnifty.com";

const CATEGORIES = [
    "usa",
    "europe",
    "russia",
    "technology",
    "opinion",
    "finance",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/archive`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/search`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.5,
        },
        ...CATEGORIES.map((cat) => ({
            url: `${SITE_URL}/${cat}`,
            lastModified: new Date(),
            changeFrequency: "hourly" as const,
            priority: 0.9,
        })),
    ];

    let postRoutes: MetadataRoute.Sitemap = [];
    let archiveMonthRoutes: MetadataRoute.Sitemap = [];

    try {
        const posts = await db.post.findMany({
            where: { status: "PUBLISHED" },
            select: {
                slug: true,
                category: true,
                updatedAt: true,
                publishedAt: true,
            },
            orderBy: { publishedAt: "desc" },
        });

        postRoutes = posts.map((post) => ({
            url: `${SITE_URL}/${post.category.toLowerCase()}/${post.slug}`,
            lastModified: post.updatedAt || post.publishedAt || new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.85,
        }));

        // Build unique year/month archive URLs
        const monthSet = new Set<string>();
        posts.forEach((p) => {
            const d = p.publishedAt || p.updatedAt;
            if (!d) return;
            const date = new Date(d);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            monthSet.add(key);
        });

        archiveMonthRoutes = Array.from(monthSet).map((key) => {
            const [year, month] = key.split("-");
            return {
                url: `${SITE_URL}/archive/${year}/${month}`,
                lastModified: new Date(),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            };
        });
    } catch (error) {
        console.error("Sitemap generation error:", error);
    }

    return [...staticRoutes, ...postRoutes, ...archiveMonthRoutes];
}