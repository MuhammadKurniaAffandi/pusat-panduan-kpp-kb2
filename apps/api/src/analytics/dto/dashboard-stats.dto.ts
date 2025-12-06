export class PieChartDataDto {
  name: string;
  value: number;
}

export class MonthlyVisitDto {
  month: string;
  views: number;
}

export class RecentArticleDto {
  id: string;
  title: string;
  status: string;
  viewCount: number;
  publishedAt: string;
  category: {
    name: string;
  };
}

export class DashboardStatsDto {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;
  totalViews: number;
  totalCategories: number;
  totalUsers?: number; // Only for admin

  // Pie Chart Data
  pieChartData: PieChartDataDto[];

  // Bar Chart Data (Monthly Visits)
  monthlyVisits: MonthlyVisitDto[];

  // Recent Published Articles
  recentArticles: RecentArticleDto[];
}
