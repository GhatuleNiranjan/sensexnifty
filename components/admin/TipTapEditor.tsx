'use client';

import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ResizableImage } from './ResizableImage';
import LinkExtension from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
  Undo,
  Redo,
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: false }),
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'article-body min-h-[350px] p-4 focus:outline-none font-serif text-[18px] leading-[1.8] text-[#1A1A1A]',
      },
    },
  });

  if (!editor) return null;

  // Handle file selection from File Manager
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Image upload failed');
      }

      const data = await res.json();

      if (data.url) {
        // Insert Cloudinary Image URL into TipTap editor
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (error) {
      console.error('Inline image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input value so same image can be re-uploaded if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    let url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank' })
      .run();
  };

  return (
    <div className="border border-[#E0E0E0] bg-white rounded-none">
      {/* Hidden File Input for Native File Manager */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E0E0E0] bg-[#F5F5F0] p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 font-bold hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('bold') ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('italic') ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('bulletList') ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('orderedList') ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('blockquote') ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={`p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors ${editor.isActive('link') ? 'bg-[#E0E0E0] text-[#1A3A5C]' : ''
            }`}
          title="Hyperlink"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* IMAGE UPLOAD BUTTON */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors flex items-center gap-1 disabled:opacity-50"
          title="Upload Inline Image"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#1A3A5C]" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>

        <div className="h-4 w-[1px] bg-[#E0E0E0] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors disabled:opacity-30"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 hover:bg-[#E0E0E0] text-[#1A1A1A] transition-colors disabled:opacity-30"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      {editor.isActive('image') && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E0E0E0] p-2 text-sm" aria-label="Image controls">
          <span>Position:</span>
          {['left', 'center', 'right'].map(align => (
            <button key={align} type="button" onMouseDown={event => event.preventDefault()}
              aria-pressed={editor.getAttributes('image').align === align}
              className="border px-2 py-1 capitalize aria-pressed:bg-gray-200"
              onClick={() => editor.chain().focus().updateAttributes('image', { align }).run()}>{align}</button>
          ))}
          <span>Size:</span>
          {[['S', '320px'], ['M', '480px'], ['L', '640px'], ['Full', '100%']].map(([label, width]) => (
            <button key={label} type="button" onMouseDown={event => event.preventDefault()}
              aria-label={`Image size ${label}`} aria-pressed={editor.getAttributes('image').width === width}
              className="border px-2 py-1 aria-pressed:bg-gray-200"
              onClick={() => editor.chain().focus().updateAttributes('image', { width }).run()}>{label}</button>
          ))}
          <span className="text-xs text-gray-600">Drag an image corner to resize.</span>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
