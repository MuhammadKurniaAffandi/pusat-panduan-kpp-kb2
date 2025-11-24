"use client";

import { useCategories, useTrackPageView } from "@/hooks";
import { CategoryCard } from "@/components/public";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function HomePage() {
  const { data: categories, isLoading, error } = useCategories();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    trackPageView.mutate({
      pagePath: "/",
      pageType: "home",
    });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-text-secondary">Memuat kategori...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Gagal memuat kategori</p>
          <p className="text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "Pastikan backend sudah berjalan di http://localhost:3001/api"}
          </p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-600">
            Belum ada kategori. Silakan tambahkan dari admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h3 className="text-xl font-semibold mb-6 text-text-primary">
        Pilih Kategori Layanan
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </div>
  );
}
