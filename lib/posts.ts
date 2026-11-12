import { db } from "@/lib/db";
import { Post } from "@/types";

const DEFAULT_AUTHOR = {
  id: "default-author",
  name: "The SensexNifty Desk",
  email: "sensexnifty501@gmail.com",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  role: "Editorial Desk",
  bio: "Independent financial journalism covering markets, geopolitics, and global economies with context and rigor.",
};

function normalizePost(post: any): Post {
  if (!post) return post;
  return {
    ...post,
    author: post.author
      ? {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
        image: post.author.image || DEFAULT_AUTHOR.image,
        role: post.author.role || DEFAULT_AUTHOR.role,
        bio: post.author.bio || DEFAULT_AUTHOR.bio,
      }
      : DEFAULT_AUTHOR,
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
}

export async function getTopStory(): Promise<Post | null> {
  const post = await db.post.findFirst({
    where: {
      status: "PUBLISHED",
      isTopStory: true,
    },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
  });
  return post ? normalizePost(post) : null;
}

export async function getSpotlightPosts(limit = 2): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      isSpotlight: true,
      isTopStory: false,
    },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

export async function getLatestPosts(limit = 5): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

export async function getCategoryPosts(category: string, limit = 6): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

export async function getOpinionPosts(limit = 3): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { isOpinion: true },
        { category: { equals: "OPINION", mode: "insensitive" } },
      ],
    },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await db.post.findUnique({
    where: { slug },
    include: { author: true },
  });
  return post ? normalizePost(post) : null;
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await db.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(normalizePost);
}

// Aliases for compatibility
export const getArticlesByCategory = getCategoryPosts;
export const getLatestArticles = getLatestPosts;