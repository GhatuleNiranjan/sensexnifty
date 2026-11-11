export type Category = "USA" | "EUROPE" | "RUSSIA" | "TECHNOLOGY" | "OPINION" | "FINANCE";
export type PostStatus = "DRAFT" | "PUBLISHED";

export interface Post {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content: string;
    category: Category;
    location?: string | null;
    author: string;
    imageUrl?: string | null;
    imageCaption?: string | null;
    pdfUrl?: string | null;
    isTopStory: boolean;
    isBreaking: boolean;
    status: PostStatus;
    views: number;
    publishedAt: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
}