import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function normalizeTags(input: unknown): string[] {
    if (!input) return [];
    const raw = Array.isArray(input) ? input.join(",") : String(input);
    const seen = new Set<string>();
    const tags: string[] = [];

    for (const part of raw.split(",")) {
        const cleaned = part.trim().replace(/^#/, "").replace(/\s+/g, " ");
        if (!cleaned) continue;
        const key = cleaned.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        tags.push(cleaned);
    }

    return tags.slice(0, 12);
}

// GET Single Post
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await params;
        const post = await db.post.findUnique({ where: { id } });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch {
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}

// PATCH / PUT Update Post
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();

        if (body.isTopStory) {
            await db.post.updateMany({
                where: { isTopStory: true },
                data: { isTopStory: false },
            });
        }

        // Build clean update object without 'undefined' values
        const updateData: Record<string, unknown> = {};

        if (body.title !== undefined) updateData.title = body.title;
        if (body.summary !== undefined || body.subtitle !== undefined) {
            updateData.summary = body.summary ?? body.subtitle ?? "";
        }
        if (body.content !== undefined) updateData.content = body.content;
        if (body.category !== undefined) {
            updateData.category = String(body.category).toUpperCase();
        }
        if (body.author !== undefined || body.authorName !== undefined) {
            updateData.author = body.author ?? body.authorName ?? "THE SENSEXNIFTY DESK";
        }
        if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
        if (body.imageCaption !== undefined) updateData.imageCaption = body.imageCaption || null;
        if (body.isTopStory !== undefined) updateData.isTopStory = Boolean(body.isTopStory);
        if (body.status !== undefined) updateData.status = body.status;
        if (body.location !== undefined) updateData.location = body.location || null;

        if (body.tags !== undefined) {
            updateData.tags = normalizeTags(body.tags);
        }

        const updatedPost = await db.post.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

export const PUT = PATCH;

// DELETE Post
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await db.post.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}