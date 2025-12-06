"use client";

interface TiptapRendererProps {
  content: string; // ✅ CHANGED: Record<string, unknown> → string (HTML)
}

export function TiptapRenderer({ content }: TiptapRendererProps) {
  return (
    <div
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-h1:text-3xl prose-h1:mb-4
        prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-8
        prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-6
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
        prose-li:mb-2
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
        prose-hr:my-8 prose-hr:border-gray-300"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
