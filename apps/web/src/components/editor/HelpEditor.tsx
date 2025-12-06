"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect, useRef } from "react";
import { uploadService } from "@/services/upload.service";
import { toast } from "sonner";
import { EditorToolbar } from "./EditorToolbar";
import { LinkDialog } from "./LinkDialog";

// Import custom details extensions
import Details from "./extensions/Details";
import DetailsSummary from "./extensions/DetailsSummary";
import DetailsContent from "./extensions/DetailsContent";

interface HelpEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function HelpEditor({
  content,
  onChange,
  placeholder = "Tulis konten artikel di sini...",
}: HelpEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
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
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
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
          class: "h-auto max-w-full rounded-base",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      // === REGISTER CUSTOM DETAILS EXTENSIONS (for Tiptap v3) ===
      Details,
      DetailsSummary,
      DetailsContent,
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
    const file = event.target.files?.[0];
    if (!file) return;

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
      const { url } = await uploadService.uploadImage(file);

      if (!editor) {
        throw new Error("Editor tidak tersedia");
      }

      if (!url) {
        throw new Error("URL gambar tidak valid");
      }

      editor.chain().focus().setImage({ src: url }).run();
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal upload gambar";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddLink = (url: string) => {
    if (url) {
      try {
        new URL(url);
        editor.chain().focus().setLink({ href: url }).run();
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
      <EditorToolbar
        editor={editor}
        onImageUpload={() => fileInputRef.current?.click()}
        onLinkToggle={() => setShowLinkDialog(!showLinkDialog)}
        isUploading={isUploading}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        disabled={isUploading}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <LinkDialog
          editor={editor}
          onClose={() => setShowLinkDialog(false)}
          onAddLink={handleAddLink}
          onRemoveLink={handleRemoveLink}
        />
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
        /* Hide default marker and render our chevron via pseudo-element */
        details.details-block summary {
          list-style: none;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
          display: block;
        }

        details.details-block summary::-webkit-details-marker {
          display: none;
        }

        /* inject chevron with CSS content based on [open] attribute */
        details.details-block summary::before {
          content: "▶";
          display: inline-block;
          margin-right: 0.5rem;
          transform-origin: center;
          transition: transform 0.12s ease;
        }

        details.details-block[open] summary::before {
          content: "▼";
        }

        details.details-block {
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 0.5rem;
          margin: 0.75rem 0;
          overflow: hidden;
        }

        details.details-block .details-content {
          padding: 0.75rem;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          background: white;
        }
        /* ============== */
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

        .prose-editor-content .ProseMirror h3 {
          font-size: 1.25em;
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

        /* Text Alignment Classes */
        .prose-editor-content .ProseMirror [style*="text-align: left"] {
          text-align: left;
        }

        .prose-editor-content .ProseMirror [style*="text-align: center"] {
          text-align: center;
        }

        .prose-editor-content .ProseMirror [style*="text-align: right"] {
          text-align: right;
        }

        .prose-editor-content .ProseMirror [style*="text-align: justify"] {
          text-align: justify;
        }
      `}</style>
    </div>
  );
}
