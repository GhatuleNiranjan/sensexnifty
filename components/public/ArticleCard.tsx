import { categoryName } from "@/lib/constants";
import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
    post: Post;
}

export default function ArticleCard({ post }: ArticleCardProps) {
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
        <article className="p-4 bg-white border border-[#E0E0E0] flex flex-col justify-between hover:border-[#1A1A1A] transition-colors">
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
                    <span className="truncate text-[#1A1A1A]">{author.name}</span>
                </div>
                <span>{publishedTime}</span>
            </div>
        </article>
    );
}
