"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface TipTapEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: value || "",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-[#E0E0E0] rounded-none bg-white">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F5F5F0] border-b border-[#E0E0E0] text-sm">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border ${editor.isActive("bold")
                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                        }`}
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-2.5 py-1 text-xs font-semibold italic rounded border ${editor.isActive("italic")
                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                        }`}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border ${editor.isActive("heading", { level: 2 })
                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                        }`}
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border ${editor.isActive("heading", { level: 3 })
                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                        }`}
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border ${editor.isActive("bulletList")
                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                        }`}
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border ${editor.isActive("orderedList")
                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                        }`}
                >
                    1. List
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border ${editor.isActive("blockquote")
                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                        }`}
                >
                    Quote
                </button>
            </div>
            <EditorContent
                editor={editor}
                className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
            />
        </div>
    );
}