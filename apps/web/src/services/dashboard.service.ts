import api from "@/lib/api";

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;
  totalViews: number;
  totalCategories: number;
  totalUsers?: number;
  recentArticles: Array<{
    id: string;
    title: string;
    status: string;
    viewCount: number;
    createdAt: string;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>("/analytics/dashboard");
    return response.data;
  },
};
