import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await db.post.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      slug,
      summary,
      content,
      category,
      imageUrl,
      location,
      isTopStory,
      isSpotlight,
      isOpinion,
      status,
      tags,
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required." },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    let parsedTags: string[] = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t: string) => t.trim().replace(/^#/, "")).filter(Boolean);
    } else if (typeof tags === "string") {
      parsedTags = tags
        .split(",")
        .map((t: string) => t.trim().replace(/^#/, ""))
        .filter(Boolean);
    }
    parsedTags = parsedTags.slice(0, 12);

    const post = await db.post.create({
      data: {
        title,
        slug: generatedSlug,
        summary: summary || "",
        content,
        category: category.toUpperCase(),
        imageUrl: imageUrl || null,
        location: location || "NEW DELHI",
        isTopStory: Boolean(isTopStory),
        isSpotlight: Boolean(isSpotlight),
        isOpinion: Boolean(isOpinion),
        status: status || "PUBLISHED",
        tags: parsedTags,
        authorId: session.user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
      include: { author: true },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}