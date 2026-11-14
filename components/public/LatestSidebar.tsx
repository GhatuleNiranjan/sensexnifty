import { categoryName } from "@/lib/constants";
import { Post } from "@/types";
import Link from "next/link";

interface LatestSidebarProps {
  posts: Post[];
}

export default function LatestSidebar({ posts }: LatestSidebarProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <aside className="space-y-6">
      <div className="pb-2 border-b-2 border-[#1A1A1A]">
        <h2 className="font-serif text-xl font-extrabold tracking-tight text-[#1A1A1A]">
          The Latest
        </h2>
      </div>

      <div className="divide-y divide-[#E0E0E0]">
        {posts.map((post) => {
          const publishedTime = post.publishedAt
            ? new Date(post.publishedAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }) + " IST"
            : "TODAY";

          return (
            <article key={post.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider">
                <span className="text-[#1A3A5C]">{categoryName(post.category)}</span>
                <span className="text-[#6B6B6B]">{publishedTime}</span>
              </div>

              <Link href={`/${post.category.toLowerCase()}/${post.slug}`}>
                <h3 className="font-serif text-sm font-bold text-[#1A1A1A] leading-snug hover:text-[#1A3A5C] transition-colors">
                  {post.title}
                </h3>
              </Link>

              {post.summary && (
                <p className="font-sans text-xs text-[#6B6B6B] line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </aside>
  );
}
