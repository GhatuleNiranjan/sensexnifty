"use client";

import { useRef, useState, useCallback } from "react";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer, NodeViewProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";

interface TipTapEditorProps {
    value: string;
    onChange: (content: string) => void;
}

/** Ensure external URLs always have a protocol */
function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;
    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("mailto:") ||
        trimmed.startsWith("tel:") ||
        trimmed.startsWith("/") ||
        trimmed.startsWith("#")
    ) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

/** Resizable & Alignable Image Node View */
function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const startX = useRef(0);
    const startWidth = useRef(0);

    const width = node.attrs.width ? String(node.attrs.width) : "100%";
    const align = (node.attrs.align as "left" | "center" | "right") || "center";

    const alignContainerClass =
        align === "left"
            ? "justify-start text-left"
            : align === "right"
                ? "justify-end text-right"
                : "justify-center text-center";

    const onResizeMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        startX.current = event.clientX;
        startWidth.current = imgRef.current?.getBoundingClientRect().width || 300;

        const onMove = (e: MouseEvent) => {
            const delta = e.clientX - startX.current;
            const next = Math.max(120, Math.min(900, Math.round(startWidth.current + delta)));
            updateAttributes({ width: `${next}px` });
        };

        const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    return (
        <NodeViewWrapper
            className={`my-6 flex w-full ${alignContainerClass}`}
            data-align={align}
        >
            <div
                className={`relative inline-block max-w-full ${selected ? "ring-2 ring-[#1A3A5C] ring-offset-2" : ""
                    }`}
                style={{ width }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imgRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt || ""}
                    title={node.attrs.title || ""}
                    className="block w-full h-auto border border-[#E0E0E0] shadow-sm"
                    draggable={false}
                />

                {/* Corner resize handles */}
                {selected && (
                    <>
                        <span
                            onMouseDown={onResizeMouseDown}
                            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-[#1A3A5C] border-2 border-white rounded-sm cursor-se-resize shadow"
                            title="Drag to resize"
                        />
                        <span
                            onMouseDown={onResizeMouseDown}
                            className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-[#1A3A5C] border-2 border-white rounded-sm cursor-sw-resize shadow"
                            title="Drag to resize"
                        />
                        <span
                            onMouseDown={onResizeMouseDown}
                            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#1A3A5C] border-2 border-white rounded-sm cursor-ne-resize shadow"
                            title="Drag to resize"
                        />
                        <span
                            onMouseDown={onResizeMouseDown}
                            className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-[#1A3A5C] border-2 border-white rounded-sm cursor-nw-resize shadow"
                            title="Drag to resize"
                        />
                        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-sans font-semibold tracking-wider uppercase text-[#1A3A5C] bg-white border border-[#E0E0E0] px-2 py-0.5 whitespace-nowrap shadow-sm">
                            Drag corners to resize ({align.toUpperCase()})
                        </div>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}

const ResizableImage = TiptapImage.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: "100%",
                renderHTML: (attributes) => ({
                    width: attributes.width,
                    style: `width: ${attributes.width}; height: auto;`,
                }),
                parseHTML: (element) =>
                    element.getAttribute("width") ||
                    (element as HTMLElement).style.width ||
                    "100%",
            },
            align: {
                default: "center",
                renderHTML: (attributes) => ({
                    "data-align": attributes.align || "center",
                    class: `align-${attributes.align || "center"}`,
                }),
                parseHTML: (element) => element.getAttribute("data-align") || "center",
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageView);
    },
});

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    class:
                        "text-[#0056b3] underline underline-offset-2 font-semibold hover:text-[#6B1C2A] cursor-pointer",
                    target: "_blank",
                    rel: "noopener noreferrer nofollow",
                },
            }),
            ResizableImage.configure({
                inline: false,
                allowBase64: false,
            }),
        ],
        content: value || "",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose max-w-none p-5 min-h-[400px] focus:outline-none " +
                    "prose-a:text-[#0056b3] prose-a:underline prose-a:font-semibold",
            },
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt(
            "Enter the full URL (example: https://onlinescada.in):",
            previousUrl || "https://"
        );

        if (url === null) return;

        if (url.trim() === "" || url.trim() === "https://") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        const href = normalizeUrl(url);

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({
                href,
                target: "_blank",
                rel: "noopener noreferrer nofollow",
            })
            .run();
    }, [editor]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Image upload failed.");
            }

            editor
                .chain()
                .focus()
                .setImage({ src: data.url, width: "640px", align: "center" })
                .run();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to upload inline image.";
            alert(message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (!editor) return null;

    const btn = (active: boolean) =>
        `px-2.5 py-1.5 text-xs font-semibold rounded border ${active
            ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
            : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
        }`;

    const isImageSelected = editor.isActive("image");
    const currentAlign = (editor.getAttributes("image").align as string) || "center";

    return (
        <div className="border border-[#E0E0E0] rounded-none bg-white">
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#F5F5F0] border-b border-[#E0E0E0]">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>
                    B
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>
                    I
                </button>

                <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>
                    H2
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))}>
                    H3
                </button>

                <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>
                    • List
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}>
                    1. List
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}>
                    Quote
                </button>

                <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

                {/* Hyperlink */}
                <button
                    type="button"
                    onClick={setLink}
                    className={btn(editor.isActive("link"))}
                    title="Add link to selected text"
                >
                    🔗 Link
                </button>
                {editor.isActive("link") && (
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded border bg-white text-[#6B1C2A] border-[#E0E0E0] hover:bg-red-50"
                        title="Remove link"
                    >
                        Unlink
                    </button>
                )}

                {/* Inline image */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded border bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100 disabled:opacity-50"
                    title="Insert graph or image"
                >
                    {isUploading ? "⏳ Uploading..." : "🖼️ Insert Image"}
                </button>

                {/* Image controls when selected */}
                {isImageSelected && (
                    <>
                        <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

                        {/* Alignment Buttons */}
                        <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-bold mr-1">
                            Align
                        </span>
                        {[
                            { label: "Left", val: "left" },
                            { label: "Center", val: "center" },
                            { label: "Right", val: "right" },
                        ].map((alignOpt) => (
                            <button
                                key={alignOpt.val}
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .updateAttributes("image", { align: alignOpt.val })
                                        .run()
                                }
                                className={`px-2 py-1.5 text-[10px] font-bold rounded border ${currentAlign === alignOpt.val
                                        ? "bg-[#1A3A5C] text-white border-[#1A3A5C]"
                                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                                    }`}
                            >
                                {alignOpt.label}
                            </button>
                        ))}

                        <div className="w-px h-5 bg-[#E0E0E0] mx-1" />

                        {/* Preset Width Buttons */}
                        <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B] font-bold mr-1">
                            Width
                        </span>
                        {[
                            { label: "S", w: "320px" },
                            { label: "M", w: "480px" },
                            { label: "L", w: "640px" },
                            { label: "Full", w: "100%" },
                        ].map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .updateAttributes("image", { width: preset.w })
                                        .run()
                                }
                                className="px-2 py-1.5 text-[10px] font-bold rounded border bg-white text-[#1A1A1A] border-[#E0E0E0] hover:bg-gray-100"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            <EditorContent editor={editor} />

            <style jsx global>{`
                .ProseMirror a {
                    color: #0056b3 !important;
                    text-decoration: underline !important;
                    text-underline-offset: 2px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .ProseMirror a:hover {
                    color: #6b1c2a !important;
                }
            `}</style>
        </div>
    );
}