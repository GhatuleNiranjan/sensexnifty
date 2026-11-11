import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await db.post.findMany({ orderBy: { publishedAt: "desc" } }));
}

// POST: Create New Article
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            title,
            summary,
            content,
            category,
            location,
            imageUrl,
            imageCaption,
            pdfUrl,
            isTopStory,
            isBreaking,
            status,
        } = body;

        if (!title?.trim() || (status !== "DRAFT" && (!content || !content.replace(/<[^>]*>/g, "").trim()))) {
            return NextResponse.json({ error: "Enter a title and full article text before publishing." }, { status: 400 });
        }

        // Generate clean slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

        // If marked as Top Story, un-top previous top story
        if (isTopStory) {
            await db.post.updateMany({
                where: { isTopStory: true },
                data: { isTopStory: false },
            });
        }

        const newPost = await db.post.create({
            data: {
                slug,
                title,
                summary,
                content: content || "",
                category,
                location: location || null,
                imageUrl: imageUrl || null,
                imageCaption: imageCaption || null,
                pdfUrl: pdfUrl || null,
                isTopStory: Boolean(isTopStory),
                isBreaking: Boolean(isBreaking),
                status: status || "PUBLISHED",
                publishedAt: new Date(),
            },
        });

        return NextResponse.json(newPost);
    } catch (error) {
        console.error("Create Post Error:", error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
