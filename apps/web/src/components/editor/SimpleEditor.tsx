"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Minus,
  Heading1,
  Heading2,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  Code2,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
// import api from "@/lib/api";
import { uploadService } from "@/services/upload.service";
import { toast } from "sonner";
interface SimpleEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function SimpleEditor({
  content,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
}: SimpleEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  // script baru dari claude pendcode
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // ✅ Configure lists properly
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-disc list-outside ml-6 space-y-2",
          },
        },
        orderedList: {
          keepMarks: true,

          keepAttributes: false,

          HTMLAttributes: {
            class: "list-decimal list-outside ml-6 space-y-2",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "leading-relaxed",
          },
        },
        // Configure other elements

        heading: {
          levels: [1, 2, 3],

          HTMLAttributes: {
            class: "font-bold",
          },
        },

        paragraph: {
          HTMLAttributes: {
            class: "mb-4 leading-relaxed",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800 cursor-pointer",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          // script baru dari claude pendcode
          class: "h-48 w-96 object-fill rounded-base",
          // class: "max-w-full h-auto rounded-lg shadow-md my-6 mx-auto block", // ✅ Fix image display
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],

    content: content,

    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4 prose-img:mx-auto prose-img:max-w-full",
      },
    },
  });

  useEffect(() => {
    /* Perbaikan masalah content tidak bisa diambil,

    script ini yang menangani.

    dan menambahkan content: content, */

    if (editor && editor.getHTML() !== content && content.length > 0) {
      editor.commands.setContent(content);
    }

    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // script baru dari claude pendcode
    const file = event.target.files?.[0];
    if (!file) return;
    // Validasi file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5MB");
      return;
    }
    setIsUploading(true);
    try {
      console.log("📤 Uploading image:", file.name);
      const { url } = await uploadService.uploadImage(file);
      console.log("✅ Image URL received:", url);
      // ✅ FIX: Pastikan editor dan url valid sebelum insert
      if (!editor) {
        throw new Error("Editor tidak tersedia");
      }
      if (!url) {
        throw new Error("URL gambar tidak valid");
      }
      editor?.chain().focus().setImage({ src: url }).run();
      console.log("✅ Image inserted to editor");
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      console.error("❌ Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal upload gambar";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    /* const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 5MB");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true);
      try {
        const res = await api.post<{ url: string }>("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // ✅ Insert image properly
        editor
          .chain()
          .focus()
          .setImage({
            src: res.data.url,
            alt: file.name,
            title: file.name,
          })
          .run();
        toast.success("Gambar berhasil diupload");
      } catch (error) {
        throw new Error(`Gagal mengupload gambar: ${(error as Error).message}`);
      } finally {
        setIsUploading(false);
      }
    };
    input.click(); */
  };

  const handleAddLink = () => {
    if (linkUrl) {
      // Validate URL
      try {
        new URL(linkUrl);
        editor.chain().focus().setLink({ href: linkUrl }).run();
        setLinkUrl("");
        setShowLinkDialog(false);
        toast.success("Link berhasil ditambahkan");
      } catch {
        toast.error("URL tidak valid");
      }
    }
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkDialog(false);
    toast.success("Link berhasil dihapus");
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 sticky top-0 z-10">
        {/* Text Formatting */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("underline") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("strike") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("code") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Headings */}
        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />
        {/* Lists - ✅ FIXED */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("codeBlock") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Block Elements */}
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Media & Links */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("link") ? "default" : "outline"}
          onClick={() => setShowLinkDialog(!showLinkDialog)}
          title="Add/Remove Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Undo/Redo */}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="p-3 border-b bg-gray-50 flex gap-2 items-center">
          <Input
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                handleAddLink();
              }
              if (e.key === "Escape") {
                setShowLinkDialog(false);
              }
            }}
            className="flex-1"
          />

          <Button type="button" size="sm" onClick={handleAddLink}>
            Tambah
          </Button>
          {editor.isActive("link") && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemoveLink}
            >
              Hapus
            </Button>
          )}
        </div>
      )}
      {/* Editor Content */}
      <div className="prose-editor-content">
        <EditorContent editor={editor} />
      </div>

      {/* Character Count */}
      <div className="border-t px-4 py-2 text-xs text-gray-500 bg-gray-50">
        {editor.storage.characterCount?.characters() || 0} karakter
      </div>

      {/* Custom CSS for Editor */}
      <style jsx global>{`
        .prose-editor-content .ProseMirror {
          min-height: 400px;
          padding: 1rem;
          outline: none;
        }

        .prose-editor-content .ProseMirror > * + * {
          margin-top: 0.75em;
        }

        .prose-editor-content .ProseMirror ul,
        .prose-editor-content .ProseMirror ol {
          padding: 0 1rem;
          margin: 1rem 0;
        }

        .prose-editor-content .ProseMirror ul {
          list-style-type: disc;
        }

        .prose-editor-content .ProseMirror ol {
          list-style-type: decimal;
        }

        .prose-editor-content .ProseMirror li {
          margin: 0.5rem 0;
        }

        .prose-editor-content .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1.5rem auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .prose-editor-content .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        .prose-editor-content .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        .prose-editor-content .ProseMirror p {
          margin-bottom: 1rem;
        }
        .prose-editor-content .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
          margin: 1rem 0;
        }

        .prose-editor-content .ProseMirror pre {
          background: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: monospace;
        }

        .prose-editor-content .ProseMirror code {
          background: #f3f4f6;
          color: #db2777;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }

        .prose-editor-content .ProseMirror pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }

        .prose-editor-content .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }

        .prose-editor-content .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }

        .prose-editor-content .ProseMirror a:hover {
          color: #1e40af;
        }
      `}</style>
    </div>
  );
}
