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

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await db.post.findMany({ orderBy: { publishedAt: "desc" } }));
}

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
            tags,
        } = body;

        if (
            !title?.trim() ||
            (status !== "DRAFT" && (!content || !content.replace(/<[^>]*>/g, "").trim()))
        ) {
            return NextResponse.json(
                { error: "Enter a title and full article text before publishing." },
                { status: 400 }
            );
        }

        const slug =
            title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

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
                summary: summary || "",
                content: content || "",
                category,
                location: location || null,
                tags: normalizeTags(tags),
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