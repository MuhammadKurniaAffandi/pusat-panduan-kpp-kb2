"use client";

import { useParams } from "next/navigation";
// import { usePublicArticle } from "@/hooks/use-articles";
import { Loader2, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { TiptapRenderer } from "@/components/editor/TiptapRenderer";
import { Breadcrumb, FeedbackButtons } from "@/components/public";
import { useEffect } from "react";
import { useTrackPageView } from "@/hooks";
import { useArticle } from "@/hooks";

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: article, isLoading, error } = useArticle(slug);
  const trackPageView = useTrackPageView();

  useEffect(() => {
    if (article && typeof window !== "undefined") {
      // Only track on client-side
      trackPageView.mutate({
        pagePath: `/informasi/${slug}`,
        pageType: "article",
        articleId: article.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Informasi Layanan tidak ditemukan.</p>
          <Link
            href="/"
            className="text-primary hover:underline mt-4 inline-block"
          >
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: article.category.name,
            href: `/bantuan/${article.category.slug}`,
          },
          {
            label: article.title,
            href: `/informasi/${article.slug}`,
          },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Back Button */}
        {/* <Link
          href="/"
          className="flex items-center gap-2 mb-6 text-sm text-primary-light hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link> */}

        {/* Article Card */}
        <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {/* Category Badge */}
          {/* <div className="mb-6">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
              {article.category.name}
            </span>
          </div> */}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-gray-600 mb-6">{article.excerpt}</p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
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
            {/* {article.author && (
              <div className="flex items-center gap-1">
                <span>Oleh: {article.author}</span>
              </div>
            )} */}
          </div>

          {/* Content */}
          <TiptapRenderer content={article.content} />
        </article>

        {/* Feedback Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Apakah informasi layanan ini membantu?
          </h3>

          <div className="mt-8">
            <FeedbackButtons articleId={article.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
