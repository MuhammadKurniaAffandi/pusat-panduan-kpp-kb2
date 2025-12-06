"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ArticleList } from "@/components/public/ArticleList";
import { useSearchArticles } from "@/hooks";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const { data: articles, isLoading } = useSearchArticles(debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="flex items-center gap-2 mb-6 text-sm text-primary-light hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>
      <h1 className="text-3xl font-bold mb-6">Pencarian</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Cari informasi layanan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p>Mencari...</p>
      ) : articles && articles.length > 0 ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Ditemukan {articles.length} informasi layanan
          </p>
          <ArticleList articles={articles} />
        </div>
      ) : debouncedQuery ? (
        <p className="text-center text-muted-foreground py-8">
          Tidak ada informasi layanan yang ditemukan untuk `{debouncedQuery}`
        </p>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          Masukkan kata kunci untuk mencari informasi layanan
        </p>
      )}
    </div>
  );
}
