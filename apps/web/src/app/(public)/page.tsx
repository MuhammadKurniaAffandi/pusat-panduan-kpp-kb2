"use client";

import { useCategories } from "@/hooks";
import { CategoryCard } from "@/components/public";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">
            Gagal memuat kategori. Silakan coba lagi.
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
        {categories?.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </div>
  );
}
