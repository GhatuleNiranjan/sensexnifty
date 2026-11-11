import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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

// PATCH Update Post
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

        const updatedPost = await db.post.update({
            where: { id },
            data: {
                title: body.title,
                summary: body.summary ?? body.subtitle,
                content: body.content,
                category: body.category?.toUpperCase(),
                author: body.author ?? body.authorName,
                imageUrl: body.imageUrl,
                imageCaption: body.imageCaption,
                isTopStory: body.isTopStory,
                status: body.status,
            },
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// DELETE Post
export const PUT = PATCH;

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
