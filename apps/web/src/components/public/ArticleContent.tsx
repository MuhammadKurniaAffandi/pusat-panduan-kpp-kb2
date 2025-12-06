"use client";

import { useEffect, useRef } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

interface ArticleContentProps {
  content: Record<string, unknown>;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const html = generateHTML(content, [
        StarterKit,
        Image,
        Link,
        Underline,
        Table,
        TableRow,
        TableHeader,
        TableCell,
      ]);

      contentRef.current.innerHTML = html;
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none
        prose-headings:text-primary prose-a:text-primary-light prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-img:shadow-md"
    />
  );
}
