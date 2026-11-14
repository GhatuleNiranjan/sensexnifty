import { categoryName } from "@/lib/constants";
import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  topStory: Post | null;
  spotlights: Post[];
}

export default function HeroSection({ topStory, spotlights }: HeroSectionProps) {
  if (!topStory) return null;

  const publishedTime = topStory.publishedAt
    ? new Date(topStory.publishedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " IST"
    : "TODAY";

  const topAuthor = topStory.author || {
    name: "The SensexNifty Desk",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  };

  return (
    <section className="space-y-6">
      {/* Primary Top Story */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-sans font-extrabold uppercase tracking-widest">
          <span className="bg-[#6B1C2A] text-white px-2 py-0.5">TOP STORY</span>
          <span className="text-[#1A3A5C]">{categoryName(topStory.category)}</span>
          {topStory.location && (
            <>
              <span className="text-[#6B6B6B]">•</span>
              <span className="text-[#6B6B6B]">{topStory.location}</span>
            </>
          )}
        </div>

        {topStory.imageUrl && (
          <Link
            href={`/${topStory.category.toLowerCase()}/${topStory.slug}`}
            className="block group overflow-hidden border border-[#E0E0E0]"
          >
            <div className="relative aspect-[16/9] w-full bg-[#F8F8F8]">
              <Image
                src={topStory.imageUrl}
                alt={topStory.title}
                fill
                priority
                className="object-cover group-hover:scale-[1.01] transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          </Link>
        )}

        <div className="space-y-3">
          <Link href={`/${topStory.category.toLowerCase()}/${topStory.slug}`}>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.15] text-[#1A1A1A] hover:text-[#1A3A5C] transition-colors">
              {topStory.title}
            </h1>
          </Link>

          {topStory.summary && (
            <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed line-clamp-3">
              {topStory.summary}
            </p>
          )}

          <div className="pt-3 flex items-center gap-3 border-t border-[#E0E0E0] text-[11px] font-sans font-bold uppercase tracking-wider text-[#6B6B6B]">
            <img
              src={topAuthor.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt={topAuthor.name}
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
            <span className="text-[#1A1A1A]">BY {topAuthor.name}</span>
            <span>•</span>
            <span>{publishedTime}</span>
          </div>
        </div>
      </div>

      {/* Secondary Spotlight 2-Column Grid */}
      {spotlights.length > 0 && (
        <div className="pt-6 border-t border-[#E0E0E0] mt-6">
          <span className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#6B6B6B] mb-4">
            FEATURED IN THIS EDITION
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {spotlights.map((spotlight) => {
              const spotlightAuthor = spotlight.author || topAuthor;
              return (
                <article
                  key={spotlight.id}
                  className="p-4 bg-[#F8F8F8] border border-[#E0E0E0] flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A3A5C]">
                      {categoryName(spotlight.category)}
                    </span>
                    <Link href={`/${spotlight.category.toLowerCase()}/${spotlight.slug}`}>
                      <h3 className="font-serif text-base font-bold text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#1A3A5C] transition-colors">
                        {spotlight.title}
                      </h3>
                    </Link>
                    {spotlight.summary && (
                      <p className="font-sans text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed">
                        {spotlight.summary}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E0E0E0] flex items-center justify-between text-[10px] font-sans font-semibold text-[#6B6B6B] uppercase">
                    <span className="truncate max-w-[120px]">{spotlightAuthor.name}</span>
                    <span>
                      {spotlight.publishedAt
                        ? new Date(spotlight.publishedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }) + " IST"
                        : "TODAY"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
