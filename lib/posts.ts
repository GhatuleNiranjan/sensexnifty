import { db } from "@/lib/db";
import { Post, Category } from "@/types";

export async function getTopStory(): Promise<Post | null> {
    const post = await db.post.findFirst({
        where: {
            status: "PUBLISHED",
            isTopStory: true,
        },
        orderBy: { publishedAt: "desc" },
    });

    if (!post) {
        return (await db.post.findFirst({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
        })) as Post | null;
    }

    return post as unknown as Post;
}

export async function getLatestArticles(limit = 5): Promise<Post[]> {
    const posts = await db.post.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: limit,
    });
    return posts as unknown as Post[];
}

export async function getArticlesByCategory(
    category: Category,
    limit = 10
): Promise<Post[]> {
    const posts = await db.post.findMany({
        where: {
            category,
            status: "PUBLISHED",
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
    });
    return posts as unknown as Post[];
}

export async function getArticleBySlug(slug: string): Promise<Post | null> {
    const post = await db.post.findFirst({
        where: { slug, status: "PUBLISHED" },
    });
    return post as unknown as Post | null;
}
