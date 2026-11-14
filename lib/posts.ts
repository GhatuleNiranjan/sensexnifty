import { cache } from "react";
import { unstable_cache } from "next/cache";
import { POST_CACHE_TAG, POST_CACHE_SECONDS } from "./post-cache";
import { db } from "@/lib/db";
import { Post } from "@/types";

const DEFAULT_AUTHOR = {
  id: "default-author",
  name: "The SensexNifty Desk",
  email: "sensexnifty501@gmail.com",
  image:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  role: "Editorial Desk",
  bio: "Independent financial journalism covering markets, geopolitics, and global economies with context and rigor.",
};

function normalizePost(post: any): Post {
  if (!post) return post;
  return {
    ...post,
    content: post.content ?? "",
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

async function fetchTopStory(): Promise<Post | null> {
  const post = await db.post.findFirst({
    where: {
      status: "PUBLISHED",
      isTopStory: true,
    },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return post ? normalizePost(post) : null;
}

async function fetchSpotlightPosts(limit = 2): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      isSpotlight: true,
      isTopStory: false,
    },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

async function fetchLatestPosts(limit = 5): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

async function fetchCategoryPosts(
  category: string,
  limit = 6
): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

async function fetchOpinionPosts(limit = 3): Promise<Post[]> {
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { isOpinion: true },
        { category: { equals: "OPINION", mode: "insensitive" } },
      ],
    },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return posts.map(normalizePost);
}

async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const post = await db.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
  });
  return post ? normalizePost(post) : null;
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await db.post.findMany({
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { createdAt: "desc" },
  });
  return posts.map(normalizePost);
}

export async function searchPosts(
  query: string,
  limit = 30
): Promise<Post[]> {
  const q = query.trim();
  if (!q) return [];

  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { tags: { has: q.toLowerCase().replace(/^#/, "") } },
        {
          author: {
            name: { contains: q, mode: "insensitive" },
          },
        },
      ],
    },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return posts.map(normalizePost);
}

async function fetchPostsByTag(
  tag: string,
  limit = 30
): Promise<Post[]> {
  const clean = tag.trim().toLowerCase().replace(/^#/, "");
  if (!clean) return [];

  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      tags: { has: clean },
    },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return posts.map(normalizePost);
}

async function fetchArchivePosts(options?: {
  year?: number;
  month?: number;
  limit?: number;
}): Promise<Post[]> {
  const { year, month, limit = 100 } = options || {};

  let gte: Date | undefined;
  let lt: Date | undefined;

  if (year && month) {
    gte = new Date(year, month - 1, 1);
    lt = new Date(year, month, 1);
  } else if (year) {
    gte = new Date(year, 0, 1);
    lt = new Date(year + 1, 0, 1);
  }

  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      ...(gte && lt
        ? {
          publishedAt: {
            gte,
            lt,
          },
        }
        : {}),
    },
    omit: { content: true },
    include: { author: { select: { id: true, name: true, email: true, image: true, role: true, bio: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return posts.map(normalizePost);
}

/** Extract distinct years and months from database */
async function fetchArchiveTree(): Promise<
  { year: number; months: { monthNumber: number; monthName: string; count: number }[] }[]
> {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    select: { publishedAt: true, createdAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const map = new Map<number, Map<number, number>>();

  posts.forEach((p) => {
    const d = p.publishedAt || p.createdAt;
    if (!d) return;
    const date = new Date(d);
    const y = date.getFullYear();
    const m = date.getMonth() + 1; // 1-12

    if (!map.has(y)) {
      map.set(y, new Map());
    }
    const yearMap = map.get(y)!;
    yearMap.set(m, (yearMap.get(m) || 0) + 1);
  });

  const tree: { year: number; months: { monthNumber: number; monthName: string; count: number }[] }[] = [];

  const sortedYears = Array.from(map.keys()).sort((a, b) => b - a);

  sortedYears.forEach((year) => {
    const yearMap = map.get(year)!;
    const sortedMonths = Array.from(yearMap.keys()).sort((a, b) => b - a);

    const months = sortedMonths.map((m) => ({
      monthNumber: m,
      monthName: monthNames[m - 1],
      count: yearMap.get(m)!,
    }));

    tree.push({ year, months });
  });

  return tree;
}


// Explicit Data Cache works with the existing dynamic routes, without caching admin data.
export const getTopStory = unstable_cache(fetchTopStory, ["getTopStory-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });
export const getSpotlightPosts = unstable_cache(fetchSpotlightPosts, ["getSpotlightPosts-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });
export const getLatestPosts = unstable_cache(fetchLatestPosts, ["getLatestPosts-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });
export const getCategoryPosts = unstable_cache(fetchCategoryPosts, ["getCategoryPosts-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });
export const getOpinionPosts = unstable_cache(fetchOpinionPosts, ["getOpinionPosts-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });
export const getPostBySlug = cache(unstable_cache(fetchPostBySlug, ["getPostBySlug-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS }));
export const getPostsByTag = unstable_cache(fetchPostsByTag, ["getPostsByTag-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });
export const getArchivePosts = unstable_cache(fetchArchivePosts, ["getArchivePosts-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });
export const getArchiveTree = unstable_cache(fetchArchiveTree, ["getArchiveTree-v1"], { tags: [POST_CACHE_TAG], revalidate: POST_CACHE_SECONDS });

export const getArticlesByCategory = getCategoryPosts;
export const getLatestArticles = getLatestPosts;
