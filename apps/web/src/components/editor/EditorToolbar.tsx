// apps/web/src/components/editor/EditorToolbar.tsx
"use client";

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Type,
  Loader2,
  ChevronDown,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  onLinkToggle: () => void;
  isUploading?: boolean;
}

export function EditorToolbar({
  editor,
  onImageUpload,
  onLinkToggle,
  isUploading = false,
}: EditorToolbarProps) {
  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50 sticky top-0 z-10">
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

      <Separator orientation="vertical" className="h-8" />

      {/* Headings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={
              editor.isActive("heading", { level: 1 }) ||
              editor.isActive("heading", { level: 2 }) ||
              editor.isActive("heading", { level: 3 })
                ? "default"
                : "outline"
            }
            title="Headings"
          >
            <Type className="h-4 w-4 mr-1" />
            <span className="text-xs">Heading</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Heading1 className="h-4 w-4 mr-2" />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Heading2 className="h-4 w-4 mr-2" />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Heading3 className="h-4 w-4 mr-2" />
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={
              editor.isActive("paragraph")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            Normal Text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-8" />

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
        variant={editor.isActive("link") ? "default" : "outline"}
        onClick={onLinkToggle}
        title="Add/Remove Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant={editor.isActive("blockquote") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-8" />

      {/* Text Alignment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" size="sm" variant="outline" title="Alignment">
            {editor.isActive({ textAlign: "center" }) ? (
              <AlignCenter className="h-4 w-4" />
            ) : editor.isActive({ textAlign: "right" }) ? (
              <AlignRight className="h-4 w-4" />
            ) : editor.isActive({ textAlign: "justify" }) ? (
              <AlignJustify className="h-4 w-4" />
            ) : (
              <AlignLeft className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={
              editor.isActive({ textAlign: "left" })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <AlignLeft className="h-4 w-4 mr-2" />
            Align Left
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={
              editor.isActive({ textAlign: "center" })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <AlignCenter className="h-4 w-4 mr-2" />
            Align Center
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={
              editor.isActive({ textAlign: "right" })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <AlignRight className="h-4 w-4 mr-2" />
            Align Right
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={
              editor.isActive({ textAlign: "justify" })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <AlignJustify className="h-4 w-4 mr-2" />
            Justify
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-8" />

      {/* Lists */}
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

      <Separator orientation="vertical" className="h-8" />

      {/* Image Upload */}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onImageUpload}
        disabled={isUploading}
        title="Upload Image"
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
        variant="outline"
        title="Insert FAQ (Details)"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertContent({
              type: "details",
              attrs: { open: false },
              content: [
                {
                  type: "detailsSummary",
                  content: [{ type: "text", text: "Summary" }],
                },
                {
                  type: "detailsContent",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: "Tulis jawaban FAQ di sini..." },
                      ],
                    },
                  ],
                },
              ],
            })
            .run()
        }
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
