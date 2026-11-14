import { categoryName } from "@/lib/constants";
import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface CategoryGridProps {
  title: string;
  categorySlug: string;
  posts: Post[];
}

export default function CategoryGrid({
  title,
  categorySlug,
  posts,
}: CategoryGridProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="my-10 pt-6 border-t-2 border-[#1A1A1A]">
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#E0E0E0]">
        <h2 className="font-serif text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
          {title}
        </h2>
        <Link
          href={`/${categorySlug}`}
          className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A3A5C] hover:underline"
        >
          View All {title} →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => {
          const author = post.author || {
            name: "The SensexNifty Desk",
            image:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
          };

          const publishedTime = post.publishedAt
            ? new Date(post.publishedAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }) + " IST"
            : "TODAY";

          return (
            <article
              key={post.id}
              className="p-4 bg-white border border-[#E0E0E0] flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
            >
              <div className="space-y-3">
                {post.imageUrl && (
                  <Link
                    href={`/${post.category.toLowerCase()}/${post.slug}`}
                    className="block group overflow-hidden border border-[#E0E0E0]"
                  >
                    <div className="relative aspect-[16/9] w-full bg-[#F8F8F8]">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-[1.01] transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </Link>
                )}

                <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                  <span className="text-[#1A3A5C]">{categoryName(post.category)}</span>
                  {post.location && (
                    <>
                      <span>•</span>
                      <span>{post.location}</span>
                    </>
                  )}
                </div>

                <Link href={`/${post.category.toLowerCase()}/${post.slug}`}>
                  <h3 className="font-serif text-base font-bold text-[#1A1A1A] leading-snug line-clamp-2 hover:text-[#1A3A5C] transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {post.summary && (
                  <p className="font-sans text-xs text-[#6B6B6B] line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E0E0E0] flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#6B6B6B]">
                <div className="flex items-center gap-2 truncate max-w-[150px]">
                  <img
                    src={
                      author.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                    }
                    alt={author.name}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                  <span className="truncate text-[#1A1A1A]">
                    {author.name}
                  </span>
                </div>
                <span>{publishedTime}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
