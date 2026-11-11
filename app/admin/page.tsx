"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Edit3, Trash2, Plus, RefreshCw } from "lucide-react";

interface Post {
    id: string;
    title: string;
    category: string;
    slug: string;
    imageUrl?: string | null;
    publishedAt: string;
    isTopStory: boolean;
}

export default function AdminDashboardPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setPosts(posts.filter((p) => p.id !== id));
            } else {
                alert("Failed to delete post.");
            }
        } catch (error) {
            alert("Error deleting post.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 font-serif">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E0E0E0]">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">
                        Article Desk Dashboard
                    </h1>
                    <p className="text-xs font-sans text-[#6B6B6B] mt-1">
                        Manage published articles, edition top stories, and site contents.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={fetchPosts}
                        className="p-2.5 border border-[#E0E0E0] bg-white text-[#1A1A1A] hover:bg-gray-100 rounded-none transition-colors"
                        title="Refresh List"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <Link
                        href="/admin/new"
                        className="flex items-center space-x-2 px-5 py-2.5 bg-[#1A3A5C] text-white hover:bg-[#142d48] text-xs font-sans font-bold uppercase tracking-wider transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Post</span>
                    </Link>
                </div>
            </div>

            {/* Content Table */}
            {loading ? (
                <div className="p-12 text-center font-serif text-[#6B6B6B]">
                    Loading published articles...
                </div>
            ) : posts.length === 0 ? (
                <div className="p-12 text-center bg-[#F8F8F8] border border-[#E0E0E0]">
                    <p className="font-serif text-[#6B6B6B] mb-4">No published articles found.</p>
                    <Link
                        href="/admin/new"
                        className="inline-block px-4 py-2 bg-[#1A3A5C] text-white font-sans text-xs font-bold uppercase"
                    >
                        Create First Article
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-[#E0E0E0] overflow-hidden">
                    <table className="w-full text-left border-collapse font-sans text-sm">
                        <thead>
                            <tr className="bg-[#F5F5F0] border-b border-[#E0E0E0] text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                                <th className="p-3 w-16">Preview</th>
                                <th className="p-3">Title</th>
                                <th className="p-3 w-28">Category</th>
                                <th className="p-3 w-32">Date</th>
                                <th className="p-3 w-36 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E0E0E0]">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3">
                                        {post.imageUrl ? (
                                            <div className="relative w-12 h-12 bg-gray-100 border border-[#E0E0E0] overflow-hidden">
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 border border-[#E0E0E0] flex items-center justify-center text-[10px] text-gray-400 uppercase">
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 font-serif font-semibold text-[#1A1A1A]">
                                        <Link
                                            href={`/${post.category}/${post.slug}`}
                                            target="_blank"
                                            className="hover:text-[#1A3A5C]"
                                        >
                                            {post.title}
                                        </Link>
                                        {post.isTopStory && (
                                            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-[#6B1C2A] text-white font-sans font-bold uppercase">
                                                TOP STORY
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3 uppercase text-xs font-semibold text-[#1A3A5C]">
                                        {post.category}
                                    </td>
                                    <td className="p-3 text-xs text-[#6B6B6B]">
                                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link
                                                href={`/${post.category}/${post.slug}`}
                                                target="_blank"
                                                className="p-1.5 border border-[#E0E0E0] text-[#1A1A1A] hover:bg-gray-100 bg-white"
                                                title="View Article"
                                            >
                                                <Eye className="w-4 h-4 text-[#1A1A1A]" />
                                            </Link>
                                            <Link
                                                href={`/admin/edit/${post.id}`}
                                                className="p-1.5 border border-[#E0E0E0] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white bg-white transition-colors"
                                                title="Edit Article"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deletingId === post.id}
                                                className="p-1.5 border border-red-200 text-red-700 hover:bg-red-700 hover:text-white bg-white transition-colors disabled:opacity-50"
                                                title="Delete Article"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}