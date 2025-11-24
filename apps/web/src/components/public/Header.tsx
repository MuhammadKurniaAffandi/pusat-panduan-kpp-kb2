"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary-light text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">DJP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Pusat Bantuan</h1>
              <p className="text-sm opacity-90 hidden sm:block">
                KPP Pratama Jakarta Kebayoran Baru Dua
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">Apa yang bisa kami bantu?</h2>
          <p className="text-base opacity-90 mb-6">
            Temukan panduan dan informasi layanan perpajakan
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari panduan, misalnya: cara daftar NPWP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
