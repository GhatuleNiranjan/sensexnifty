"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeletePostButtonProps {
    postId: string;
    postTitle: string;
}

export default function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete post.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-[#6B1C2A] hover:bg-[#6B1C2A] hover:text-white border border-[#E0E0E0] bg-white transition-colors disabled:opacity-50 cursor-pointer"
            title="Delete Article"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}