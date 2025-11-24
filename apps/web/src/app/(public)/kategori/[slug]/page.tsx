"use client";

import { useParams } from "next/navigation";
import { useArticlesByCategory } from "@/hooks";
import { Breadcrumb, ArticleList } from "@/components/public";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import * as Icons from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, error } = useArticlesByCategory(slug);

  if (isLoading) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Loading..." }]} />
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Error" }]} />
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Kategori tidak ditemukan.</p>
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

  const { category, articles } = data;

  // Get icon component
  const IconComponent = category.icon
    ? (Icons[category.icon as keyof typeof Icons] as React.ComponentType<{
        className?: string;
      }>)
    : Icons.Folder;

  return (
    <div>
      <Breadcrumb
        items={[{ label: category.name, href: `/kategori/${category.slug}` }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="flex items-center gap-2 mb-6 text-sm text-primary-light hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-lg bg-primary/10">
            <IconComponent className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {category.name}
            </h2>
            <p className="text-sm text-text-secondary">
              {category.description}
            </p>
          </div>
        </div>

        <ArticleList articles={articles} />
      </div>
    </div>
  );
}
