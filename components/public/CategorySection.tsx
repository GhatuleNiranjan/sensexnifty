import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { Post } from "@/types";

interface CategorySectionProps {
    title: string;
    categorySlug: string;
    articles: Post[];
}

export default function CategorySection({
    title,
    categorySlug,
    articles,
}: CategorySectionProps) {
    return (
        <section className="py-8 border-t-2 border-[#1A1A1A]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-6 border-b border-[#E0E0E0] pb-2">
                <h2
                    className="text-2xl font-black uppercase text-[#1A1A1A] tracking-tight"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                    {title}
                </h2>
                <Link
                    href={`/${categorySlug}`}
                    className="text-xs font-bold text-[#1A3A5C] hover:underline uppercase tracking-wider"
                >
                    VIEW ALL {title} →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((article: Post) => (
                    <ArticleCard key={article.id} article={article} showImage={true} />
                ))}
            </div>
        </section>
    );
}