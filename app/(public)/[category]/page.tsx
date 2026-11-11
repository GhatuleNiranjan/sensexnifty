import { notFound } from "next/navigation";
import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import Navigation from "@/components/public/Navigation";
import EditionStrip from "@/components/public/EditionStrip";
import ArticleCard from "@/components/public/ArticleCard";
import Footer from "@/components/public/Footer";
import { getArticlesByCategory } from "@/lib/posts";
import { Category, Post } from "@/types";

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export const revalidate = 0;

const VALID_CATEGORIES: Category[] = [
    "USA",
    "EUROPE",
    "RUSSIA",
    "TECHNOLOGY",
    "OPINION",
    "FINANCE",
];

export default async function CategoryPage({ params }: CategoryPageProps) {
    const resolvedParams = await params;
    const rawCat = resolvedParams.category.toUpperCase() as Category;

    if (!VALID_CATEGORIES.includes(rawCat)) {
        notFound();
    }

    const articles = await getArticlesByCategory(rawCat, 20);

    return (
        <main className="min-h-screen bg-white">
            <TopBar />
            <Masthead />
            <Navigation />
            <EditionStrip />

            <section className="bg-[#F8F8F8] border-b border-[#E0E0E0] py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-[10px] font-bold tracking-widest text-[#6B6B6B] uppercase">
                        SENSEXNIFTY COVERAGE
                    </div>
                    <h1
                        className="text-4xl md:text-6xl font-black uppercase text-[#1A1A1A] mt-2"
                        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                        {rawCat}
                    </h1>
                    <p className="mt-3 text-xs md:text-sm text-[#6B6B6B] max-w-2xl leading-relaxed">
                        Latest financial reporting, markets, and policy analysis across {rawCat}.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-12">
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {articles.map((article: Post) => (
                            <ArticleCard key={article.id} article={article} showImage={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-sm text-[#6B6B6B] uppercase tracking-wider">
                        NO ARTICLES PUBLISHED IN {rawCat} YET.
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}