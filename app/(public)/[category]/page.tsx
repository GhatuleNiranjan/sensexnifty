import { getCategoryPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Masthead from "@/components/public/Masthead";
import CategoryNav from "@/components/public/CategoryNav";
import EditionStrip from "@/components/public/EditionStrip";
import Footer from "@/components/public/Footer";

const VALID_CATEGORIES = [
  "usa",
  "europe",
  "russia",
  "technology",
  "opinion",
  "finance",
];

export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const lowerCategory = category.toLowerCase();

  if (!VALID_CATEGORIES.includes(lowerCategory)) {
    notFound();
  }

  const posts = await getCategoryPosts(category.toUpperCase(), 12);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-serif">
      <TopBar />
      <Masthead />
      <CategoryNav />
      <EditionStrip />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="pb-4 mb-8 border-b-2 border-[#1A1A1A] flex items-center justify-between">
          <h1 className="font-serif text-3xl font-extrabold uppercase text-[#1A1A1A]">
            {category} Edition
          </h1>
          <span className="text-xs font-sans text-[#6B6B6B] font-bold uppercase tracking-widest">
            {posts.length} Dispatches Published
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 text-center bg-[#F8F8F8] border border-[#E0E0E0] my-8">
            <p className="font-serif italic text-base text-[#6B6B6B]">
              No dispatches currently published under the {category.toUpperCase()} section.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => {
              const author = post.author || {
                name: "The SensexNifty Desk",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
              };

              const publishedTime = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "TODAY";

              return (
                <article
                  key={post.id}
                  className="p-5 bg-white border border-[#E0E0E0] flex flex-col justify-between hover:border-[#1A1A1A] transition-colors"
                >
                  <div className="space-y-3">
                    {post.imageUrl && (
                      <Link
                        href={`/${post.category.toLowerCase()}/${post.slug}`}
                        className="block overflow-hidden border border-[#E0E0E0]"
                      >
                        <div className="relative aspect-[16/9] w-full bg-[#F8F8F8]">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      </Link>
                    )}

                    <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-[#6B6B6B]">
                      <span className="text-[#1A3A5C]">{post.category}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span>{post.location}</span>
                        </>
                      )}
                    </div>

                    <Link href={`/${post.category.toLowerCase()}/${post.slug}`}>
                      <h2 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug hover:text-[#1A3A5C] transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    {post.summary && (
                      <p className="font-sans text-xs text-[#6B6B6B] line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#E0E0E0] flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#6B6B6B]">
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
        )}
      </main>

      <Footer />
    </div>
  );
}