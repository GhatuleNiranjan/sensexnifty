import { Post } from "@/types";
import Link from "next/link";

interface OpinionSectionProps {
  opinions: Post[];
}

export default function OpinionSection({ opinions }: OpinionSectionProps) {
  if (!opinions || opinions.length === 0) return null;

  return (
    <section className="my-12 pt-8 border-t-2 border-[#1A1A1A] bg-[#F8F8F8] p-6 sm:p-8 border border-[#E0E0E0]">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E0E0E0]">
        <div>
          <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.25em] text-[#6B1C2A]">
            EDITORIAL & ESSAYS
          </span>
          <h2 className="font-serif text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
            OPINION & PERSPECTIVE
          </h2>
        </div>
        <Link
          href="/opinion"
          className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A3A5C] hover:underline"
        >
          All Essays →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opinions.map((opinion) => {
          const author = opinion.author || {
            name: "The SensexNifty Desk",
            role: "Editorial Desk",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
          };

          return (
            <article
              key={opinion.id}
              className="bg-white p-5 border border-[#E0E0E0] flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                  Editorial Column
                </span>

                <Link href={`/${opinion.category.toLowerCase()}/${opinion.slug}`}>
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug hover:text-[#1A3A5C] transition-colors">
                    &ldquo;{opinion.title}&rdquo;
                  </h3>
                </Link>

                {opinion.summary && (
                  <p className="font-sans text-xs text-[#6B6B6B] italic leading-relaxed line-clamp-3">
                    {opinion.summary}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E0E0E0] flex items-center gap-3">
                <img
                  src={author.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#E0E0E0]"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A1A1A] truncate">
                    BY {author.name}
                  </p>
                  <p className="text-[10px] font-sans text-[#6B6B6B] truncate">
                    {author.role || "Columnist"}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}