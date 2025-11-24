import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleStatus, PageType } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  /**
   * Hash IP address untuk privacy
   */
  private hashIp(ip: string): string {
    return crypto
      .createHash('sha256')
      .update(ip)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Get semua categories yang aktif dengan jumlah artikel published
   */
  async getCategories() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.published },
            },
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      articleCount: cat._count.articles,
    }));
  }

  /**
   * Get articles by category slug (hanya yang published)
   */
  async getArticlesByCategory(categorySlug: string) {
    // Cek category exists
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    const articles = await this.prisma.article.findMany({
      where: {
        categoryId: category.id,
        status: ArticleStatus.published,
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImageUrl: true,
        publishedAt: true,
        viewCount: true,
      },
    });

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
      },
      articles,
    };
  }

  /**
   * Get article detail by slug (hanya yang published)
   */
  async getArticleBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            fullName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Artikel tidak ditemukan');
    }

    if (article.status !== ArticleStatus.published) {
      throw new NotFoundException('Artikel tidak ditemukan');
    }

    // Return tanpa info sensitif
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImageUrl: article.featuredImageUrl,
      publishedAt: article.publishedAt,
      viewCount: article.viewCount,
      helpfulYes: article.helpfulYes,
      helpfulNo: article.helpfulNo,
      author: article.author.fullName,
      category: article.category,
    };
  }

  /**
   * Search articles (hanya yang published)
   */
  async searchArticles(query: string, limit = 10) {
    if (!query || query.length < 2) {
      return [];
    }

    const articles = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.published,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return articles;
  }

  /**
   * Track page view
   */
  async trackPageView(
    pagePath: string,
    pageType: PageType,
    articleId?: string,
    ip?: string,
    userAgent?: string,
  ) {
    await this.prisma.pageView.create({
      data: {
        pagePath,
        pageType,
        articleId,
        visitorIpHash: ip ? this.hashIp(ip) : null,
        userAgent: userAgent?.substring(0, 500),
      },
    });

    // Update view count jika article
    if (articleId) {
      await this.prisma.article.update({
        where: { id: articleId },
        data: { viewCount: { increment: 1 } },
      });
    }

    return { success: true };
  }

  /**
   * Record article feedback (helpful/not helpful)
   */
  async recordFeedback(articleId: string, helpful: boolean) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Artikel tidak ditemukan');
    }

    await this.prisma.article.update({
      where: { id: articleId },
      data: helpful
        ? { helpfulYes: { increment: 1 } }
        : { helpfulNo: { increment: 1 } },
    });

    return { success: true, message: 'Terima kasih atas feedback Anda' };
  }

  /**
   * Get popular articles
   */
  async getPopularArticles(limit = 5) {
    const articles = await this.prisma.article.findMany({
      where: { status: ArticleStatus.published },
      orderBy: { viewCount: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        viewCount: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return articles;
  }

  /**
   * Get recent articles
   */
  async getRecentArticles(limit = 5) {
    const articles = await this.prisma.article.findMany({
      where: { status: ArticleStatus.published },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return articles;
  }
}
