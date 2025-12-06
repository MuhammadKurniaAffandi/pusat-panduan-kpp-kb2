"use client";

import { useState } from "react"; //useEffect
import { Editor } from "@tiptap/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LinkDialogProps {
  editor: Editor;
  onClose: () => void;
  onAddLink: (url: string) => void;
  onRemoveLink: () => void;
}

export function LinkDialog({
  editor,
  onClose,
  onAddLink,
  onRemoveLink,
}: LinkDialogProps) {
  const [linkUrl, setLinkUrl] = useState("");

  /* useEffect(() => {
    // Set existing link URL if editing
    const { href } = editor.getAttributes("link");
    if (href) {
      setLinkUrl(href);
    }
  }, [editor]); */

  const handleSubmit = () => {
    if (linkUrl.trim()) {
      try {
        new URL(linkUrl);
        onAddLink(linkUrl);
        setLinkUrl("");
      } catch {
        toast.error("URL tidak valid");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="p-3 border-b bg-gray-50 flex gap-2 items-center">
      <Input
        placeholder="https://example.com"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        autoFocus
      />
      <Button type="button" size="sm" onClick={handleSubmit}>
        {editor.isActive("link") ? "Update" : "Tambah"}
      </Button>
      {editor.isActive("link") && (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onRemoveLink}
        >
          Hapus
        </Button>
      )}
      <Button type="button" size="sm" variant="ghost" onClick={onClose}>
        Batal
      </Button>
    </div>
  );
}
