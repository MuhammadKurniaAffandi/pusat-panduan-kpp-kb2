import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleStatus } from '@prisma/client';
import {
  DashboardStatsDto,
  PieChartDataDto,
  MonthlyVisitDto,
  RecentArticleDto,
} from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(
    userId?: string,
    userRole?: string,
  ): Promise<DashboardStatsDto> {
    const isAdmin = userRole === 'admin';

    // Base where clause for RBAC
    const articleWhere = isAdmin ? {} : { authorId: userId };

    // Parallel fetch all data
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      archivedArticles,
      totalViews,
      totalCategories,
      totalUsers,
      recentArticles,
      pieChartData,
      monthlyVisits,
    ] = await Promise.all([
      // 1. Total Articles
      this.prisma.article.count({ where: articleWhere }),

      // 2. Published Articles
      this.prisma.article.count({
        where: { ...articleWhere, status: ArticleStatus.published },
      }),

      // 3. Draft Articles
      this.prisma.article.count({
        where: { ...articleWhere, status: ArticleStatus.draft },
      }),

      // 4. Archived Articles
      this.prisma.article.count({
        where: { ...articleWhere, status: ArticleStatus.archived },
      }),

      // 5. Total Views
      this.prisma.article.aggregate({
        where: articleWhere,
        _sum: { viewCount: true },
      }),

      // 6. Total Categories
      this.prisma.category.count(),

      // 7. Total Users (Admin only)
      isAdmin ? this.prisma.user.count() : Promise.resolve(0),

      // 8. Recent Published Articles
      this.getRecentPublishedArticles(articleWhere),

      // 9. Pie Chart Data
      this.getPieChartData(isAdmin, userId),

      // 10. Monthly Visits (Current Year)
      this.getMonthlyVisits(isAdmin, userId),
    ]);

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      archivedArticles,
      totalViews: totalViews._sum.viewCount || 0,
      totalCategories,
      totalUsers: isAdmin ? totalUsers : undefined,
      pieChartData,
      monthlyVisits,
      recentArticles,
    };
  }

  /**
   * 📊 Pie Chart Data
   * - Admin: Total published articles + Total categories
   * - Staff: Only their published articles + Total categories
   */
  private async getPieChartData(
    isAdmin: boolean,
    userId?: string,
  ): Promise<PieChartDataDto[]> {
    const articleWhere = isAdmin ? {} : { authorId: userId };

    const [publishedCount, categoryCount] = await Promise.all([
      this.prisma.article.count({
        where: { ...articleWhere, status: ArticleStatus.published },
      }),
      this.prisma.category.count(),
    ]);

    return [
      {
        name: 'Informasi Layanan',
        value: publishedCount,
      },
      {
        name: 'Panduan Layanan',
        value: categoryCount,
      },
    ];
  }

  /**
   * 📈 Bar Chart: Monthly Visits (Current Calendar Year)
   * - Returns data for Jan-Dec of current year
   * - If no data for a month, returns 0
   */
  private async getMonthlyVisits(
    isAdmin: boolean,
    userId?: string,
  ): Promise<MonthlyVisitDto[]> {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // Jan 1
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59); // Dec 31

    // Get article IDs based on role
    let articleIds: string[] | undefined;
    if (!isAdmin && userId) {
      const userArticles = await this.prisma.article.findMany({
        where: { authorId: userId, status: ArticleStatus.published },
        select: { id: true },
      });
      articleIds = userArticles.map((a) => a.id);
    }

    // Fetch page views
    const pageViews = await this.prisma.pageView.groupBy({
      by: ['viewedAt'],
      where: {
        viewedAt: {
          gte: startDate,
          lte: endDate,
        },
        pageType: 'article',
        ...(articleIds && { articleId: { in: articleIds } }),
      },
      _count: {
        id: true,
      },
    });

    // Group by month
    const monthlyData = new Map<number, number>(); // month (0-11) -> count

    pageViews.forEach((view) => {
      const month = view.viewedAt.getMonth();
      monthlyData.set(month, (monthlyData.get(month) || 0) + view._count.id);
    });

    // Generate full 12 months data
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    return monthNames.map((name, index) => ({
      month: `${name}`,
      views: monthlyData.get(index) || 0,
    }));
  }

  /**
   * 📰 Recent Published Articles (Top 5)
   */
  private async getRecentPublishedArticles(articleWhere: {
    authorId?: string;
  }): Promise<RecentArticleDto[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        ...articleWhere,
        status: ArticleStatus.published,
        publishedAt: { not: null },
      },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        viewCount: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return articles.map((article) => ({
      ...article,
      publishedAt: article.publishedAt?.toISOString() || '',
    }));
  }
}
