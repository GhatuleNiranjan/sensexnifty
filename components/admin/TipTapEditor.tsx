"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { useMemo, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function normalizeUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [editorLinkUrl, setEditorLinkUrl] = useState("");
  const [showLinkInput, setShowLinkUrlInput] = useState(false);

  const extensions = useMemo(
    () => [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "tiptap-image max-w-full h-auto border border-[#E0E0E0] my-4",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#0056b3] underline underline-offset-2 hover:text-[#003d80]",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[320px] p-4 text-[#1A1A1A] font-serif leading-relaxed [&_a]:text-[#0056b3] [&_a]:underline",
      },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    if (!editorLinkUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkUrlInput(false);
      return;
    }

    const normalized = normalizeUrl(editorLinkUrl);
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: normalized, target: "_blank" })
      .run();

    setEditorLinkUrl("");
    setShowLinkUrlInput(false);
  };

  const addInlineImage = () => {
    const url = prompt("Enter Image URL (or upload image using Cover field):");
    if (url) {
      const normalized = normalizeUrl(url);
      editor.chain().focus().setImage({ src: normalized }).run();
    }
  };

  return (
    <div className="border border-[#E0E0E0] bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F8F8F8] border-b border-[#E0E0E0]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("bold") ? "bg-[#E0E0E0] font-bold" : ""
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("italic") ? "bg-[#E0E0E0]" : ""
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-[#E0E0E0]" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-[#E0E0E0]" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("bulletList") ? "bg-[#E0E0E0]" : ""
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("orderedList") ? "bg-[#E0E0E0]" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("blockquote") ? "bg-[#E0E0E0]" : ""
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={() => setShowLinkUrlInput(!showLinkInput)}
          className={`p-2 hover:bg-[#E0E0E0] transition-colors ${
            editor.isActive("link") ? "bg-[#E0E0E0] text-[#0056b3]" : ""
          }`}
          title="Hyperlink"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addInlineImage}
          className="p-2 hover:bg-[#E0E0E0] transition-colors"
          title="Insert Inline Image/Graph"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 hover:bg-[#E0E0E0] transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 hover:bg-[#E0E0E0] transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Popover Link Input */}
      {showLinkInput && (
        <div className="p-3 bg-[#F5F5F0] border-b border-[#E0E0E0] flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste URL (e.g. moneycontrol.com or https://...)"
            value={editorLinkUrl}
            onChange={(e) => setEditorLinkUrl(e.target.value)}
            className="flex-1 text-xs font-sans p-2 bg-white border border-[#E0E0E0] focus:outline-none"
          />
          <button
            type="button"
            onClick={setLink}
            className="bg-[#1A1A1A] text-white text-xs font-sans font-bold uppercase tracking-wider px-3 py-2"
          >
            Apply Link
          </button>
        </div>
      )}

      {/* Editor Surface */}
      <EditorContent editor={editor} />
    </div>
  );
}