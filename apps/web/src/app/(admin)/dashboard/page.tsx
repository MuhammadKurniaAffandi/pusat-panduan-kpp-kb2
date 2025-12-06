"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Eye,
  FolderOpen,
  Users,
  CheckCircle,
  FileEdit,
  Archive,
  Loader2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// ============================================
// TYPES
// ============================================

interface PieChartData {
  name: string;
  value: number;
}

interface MonthlyVisit {
  month: string;
  views: number;
}

interface RecentArticle {
  id: string;
  title: string;
  status: string;
  viewCount: number;
  publishedAt: string;
  category: {
    name: string;
  };
}

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;
  totalViews: number;
  totalCategories: number;
  totalUsers?: number;
  pieChartData: PieChartData[];
  monthlyVisits: MonthlyVisit[];
  recentArticles: RecentArticle[];
}

// ============================================
// COLORS
// ============================================

const COLORS = {
  primary: "#003366",
  secondary: "#D4AF37",
  accent: "#0052A3",
  light: "#E5C158",
  muted: "#6B7280",
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary];

// ============================================
// CUSTOM TOOLTIP
// ============================================

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-lg font-bold text-primary mt-1">
          {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get<DashboardStats>("/analytics/dashboard");
      return res.data;
    },
    refetchInterval: 30000, // Refresh setiap 30 detik
  });

  // ============================================
  // LOADING STATE
  // ============================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-sm text-red-700 mb-4">
            Terjadi kesalahan saat mengambil data dashboard. Silakan refresh
            halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============================================
          HEADER
      ============================================ */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang di panel administrasi KPP Help Center
        </p>
      </div>

      {/* ============================================
          STATS CARDS (4 Columns)
      ============================================ */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
       
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Artikel
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {data?.totalArticles || 0}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                {data?.publishedArticles || 0} Published
              </span>
              <span className="flex items-center gap-1 text-yellow-600">
                <FileEdit className="w-3 h-3" />
                {data?.draftArticles || 0} Draft
              </span>
            </div>
          </CardContent>
        </Card>

        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Dilihat
            </CardTitle>
            <Eye className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(data?.totalViews || 0).toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Dari semua artikel published
            </p>
          </CardContent>
        </Card>

        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Kategori
            </CardTitle>
            <FolderOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {data?.totalCategories || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">Kategori aktif</p>
          </CardContent>
        </Card>

       
        {data?.totalUsers !== undefined && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Pengguna
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {data.totalUsers}
              </div>
              <p className="text-xs text-gray-500 mt-2">Admin & Staff</p>
            </CardContent>
          </Card>
        )}
      </div> */}

      {/* ============================================
          CHARTS SECTION (2 Columns: Pie + Bar)
      ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============================================
            PIE CHART - Distribusi Data
        ============================================ */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Distribusi Data
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Panduan layanan aktif dan informasi layanan published
            </p>
          </CardHeader>
          <CardContent>
            {data?.pieChartData && data.pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    className="text-xs"
                    data={data.pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {data.pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Tidak ada data
              </div>
            )}
          </CardContent>
        </Card>

        {/* ============================================
            BAR CHART - Kunjungan Bulanan
        ============================================ */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Kunjungan Informasi Layanan (Bulanan)
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Statistik views per bulan tahun {new Date().getFullYear()}
            </p>
          </CardHeader>
          <CardContent>
            {data?.monthlyVisits && data.monthlyVisits.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.monthlyVisits}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    // angle={-45}
                    // textAnchor="end"
                    height={80}
                    // tickLine={false}
                    tickMargin={10}
                    // axisLine={false}
                    // tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="views"
                    fill={COLORS.primary}
                    radius={[8, 8, 0, 0]}
                    name="Kunjungan"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Tidak ada data kunjungan
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          RECENT ARTICLES TABLE (1 Column Full Width)
      ============================================ */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Informasi Layanan Terbaru (Published)
          </CardTitle>
          {/* <p className="text-sm text-gray-600 mt-1">
            5 artikel yang baru dipublikasikan
          </p> */}
        </CardHeader>
        <CardContent>
          {data?.recentArticles && data.recentArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Informasi Layanan
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Panduan Layanan
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Views
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Tanggal Publish
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentArticles.map((article, index) => (
                    <tr
                      key={article.id}
                      className={`
                        border-b border-gray-100 hover:bg-gray-50 transition-colors
                        ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      `}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 text-sm mt-0.5">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-medium text-gray-900 line-clamp-2">
                            {article.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {article.category.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {article.viewCount.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {format(
                            new Date(article.publishedAt),
                            "dd MMM yyyy, HH:mm",
                            { locale: id }
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Archive className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">
                Belum ada informasi layanan yang dipublikasikan
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
