import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { PublicArticle } from "@/types";

interface ArticleListProps {
  articles: PublicArticle[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-text-secondary">
          Belum ada artikel dalam kategori ini
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {articles.map((article, idx) => (
        <Link key={article.id} href={`/artikel/${article.slug}`}>
          <div
            className={`p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
              idx < articles.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-5 h-5 text-primary-light flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-base text-text-primary block truncate">
                  {article.title}
                </span>
                {article.excerpt && (
                  <span className="text-sm text-text-secondary block truncate mt-1">
                    {article.excerpt}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
          </div>
        </Link>
      ))}
    </div>
  );
}
