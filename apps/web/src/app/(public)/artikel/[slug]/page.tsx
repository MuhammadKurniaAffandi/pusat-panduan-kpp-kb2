"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useArticle, useTrackPageView } from "@/hooks";
import { Breadcrumb, FeedbackButtons } from "@/components/public";
import { ArrowLeft, Loader2, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { TiptapRenderer } from "@/components/editor";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: article, isLoading, error } = useArticle(slug);
  const trackPageView = useTrackPageView();

  useEffect(() => {
    if (article && typeof window !== "undefined") {
      // Only track on client-side
      trackPageView.mutate({
        pagePath: `/artikel/${slug}`,
        pageType: "article",
        articleId: article.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]); // Only re-run when article ID changes

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Loading..." }]} />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Error" }]} />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Artikel tidak ditemukan.</p>
            <Link
              href="/"
              className="text-primary-light hover:underline mt-4 inline-block"
            >
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          {
            label: article.category.name,
            href: `/kategori/${article.category.slug}`,
          },
          { label: article.title },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link
          href={`/kategori/${article.category.slug}`}
          className="flex items-center gap-2 mb-6 text-sm text-primary-light hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke {article.category.name}
        </Link>

        <article className="bg-white rounded-xl border border-border p-8">
          <div className="mb-6">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
              {article.category.name}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-text-primary">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-text-secondary mb-8 pb-8 border-b border-border">
            {article.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(article.publishedAt), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount} views</span>
            </div>
          </div>

          {/* Render Tiptap Content - Will implement in next step */}
          <div className="prose prose-base max-w-none">
            <TiptapRenderer content={article.content} />
          </div>
        </article>

        <div className="mt-8">
          <FeedbackButtons articleId={article.id} />
        </div>
      </div>
    </div>
  );
}
