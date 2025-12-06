import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  categoryStats: Array<{
    id: string;
    name: string;
    articleCount: number;
  }>;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await api.get<DashboardStats>("/analytics/dashboard");
      return response.data;
    },
  });
}
