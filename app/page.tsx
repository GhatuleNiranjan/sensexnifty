import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import CategoryNav from "@/components/public/CategoryNav";
import EditionStrip from "@/components/public/EditionStrip";
import HeroSection from "@/components/public/HeroSection";
import LatestSidebar from "@/components/public/LatestSidebar";
import CategoryGrid from "@/components/public/CategoryGrid";
import OpinionSection from "@/components/public/OpinionSection";
import Footer from "@/components/public/Footer";

import {
  getTopStory,
  getSpotlightPosts,
  getLatestPosts,
  getCategoryPosts,
  getOpinionPosts,
} from "@/lib/posts";

export const revalidate = 0;

export default async function HomePage() {
  const topStory = await getTopStory();
  const spotlights = await getSpotlightPosts(2);
  const latestPosts = await getLatestPosts(5);
  const financePosts = await getCategoryPosts("FINANCE", 3);
  const opinionPosts = await getOpinionPosts(3);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-serif">
      <TopBar />
      <Masthead />
      <CategoryNav />
      <EditionStrip />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[#E0E0E0] pb-8">
          <div className="lg:col-span-8">
            <HeroSection topStory={topStory} spotlights={spotlights} />
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-[#E0E0E0] lg:pl-8">
            <LatestSidebar posts={latestPosts} />
          </div>
        </div>

        {financePosts.length > 0 && (
          <CategoryGrid
            title="Indian Markets & Finance"
            categorySlug="finance"
            posts={financePosts}
          />
        )}

        {opinionPosts.length > 0 && (
          <OpinionSection opinions={opinionPosts} />
        )}
      </main>

      <Footer />
    </div>
  );
}