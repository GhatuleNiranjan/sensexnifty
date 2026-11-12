import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existingPost = await db.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let parsedTags: string[] | undefined;
    if (body.tags !== undefined) {
      if (Array.isArray(body.tags)) {
        parsedTags = body.tags
          .map((t: string) => t.trim().replace(/^#/, ""))
          .filter(Boolean);
      } else if (typeof body.tags === "string") {
        parsedTags = body.tags
          .split(",")
          .map((t: string) => t.trim().replace(/^#/, ""))
          .filter(Boolean);
      }
      if (parsedTags) parsedTags = parsedTags.slice(0, 12);
    }

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.summary !== undefined) updateData.summary = body.summary;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.category !== undefined) updateData.category = body.category.toUpperCase();
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.isTopStory !== undefined) updateData.isTopStory = Boolean(body.isTopStory);
    if (body.isSpotlight !== undefined) updateData.isSpotlight = Boolean(body.isSpotlight);
    if (body.isOpinion !== undefined) updateData.isOpinion = Boolean(body.isOpinion);
    if (body.status !== undefined) updateData.status = body.status;
    if (parsedTags !== undefined) updateData.tags = parsedTags;

    if (!existingPost.authorId) {
      updateData.authorId = session.user.id;
    }

    const updatedPost = await db.post.update({
      where: { id },
      data: updateData,
      include: { author: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}