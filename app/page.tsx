import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import Navigation from "@/components/public/Navigation";
import EditionStrip from "@/components/public/EditionStrip";
import HeroSection from "@/components/public/HeroSection";
import LatestSidebar from "@/components/public/LatestSidebar";
import CategorySection from "@/components/public/CategorySection";
import OpinionSection from "@/components/public/OpinionSection";
import Footer from "@/components/public/Footer";

import {
  getTopStory,
  getLatestArticles,
  getArticlesByCategory,
} from "@/lib/posts";

export const revalidate = 0;

export default async function HomePage() {
  const topStory = await getTopStory();
  const latestArticles = await getLatestArticles(6);
  const financeArticles = await getArticlesByCategory("FINANCE", 3);
  const opinionArticles = await getArticlesByCategory("OPINION", 2);

  // Take the first 4 for the sidebar, and next 2 for secondary hero feature
  const sidebarArticles = latestArticles.slice(0, 4);
  const secondaryHeroArticles = latestArticles.slice(2, 4);

  return (
    <main className="min-h-screen bg-white">
      <TopBar />
      <Masthead />
      <Navigation />
      <EditionStrip />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            {topStory && (
              <HeroSection
                article={topStory}
                secondaryArticles={secondaryHeroArticles}
              />
            )}
          </div>
          <div className="lg:col-span-4">
            <LatestSidebar articles={sidebarArticles} />
          </div>
        </div>
      </section>

      {financeArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <CategorySection
            title="Indian Markets & Finance"
            categorySlug="finance"
            articles={financeArticles}
          />
        </section>
      )}

      {opinionArticles.length > 0 && (
        <OpinionSection articles={opinionArticles} />
      )}

      <Footer />
    </main>
  );
}