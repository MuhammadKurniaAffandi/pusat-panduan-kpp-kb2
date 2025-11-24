import api from "@/lib/api";
import { PublicCategory, PublicArticle, PublicArticleDetail } from "@/types";

export const publicService = {
  async getCategories(): Promise<PublicCategory[]> {
    const response = await api.get<PublicCategory[]>("/public/categories");
    return response.data;
  },

  async getArticlesByCategory(slug: string): Promise<{
    category: PublicCategory;
    articles: PublicArticle[];
  }> {
    const response = await api.get<{
      category: PublicCategory;
      articles: PublicArticle[];
    }>(`/public/categories/${slug}`);
    return response.data;
  },

  async getArticleBySlug(slug: string): Promise<PublicArticleDetail> {
    const response = await api.get<PublicArticleDetail>(
      `/public/articles/${slug}`
    );
    return response.data;
  },

  async searchArticles(
    query: string,
    limit?: number
  ): Promise<PublicArticle[]> {
    const response = await api.get<PublicArticle[]>("/public/articles/search", {
      params: { q: query, limit },
    });
    return response.data;
  },

  async getPopularArticles(limit?: number): Promise<PublicArticle[]> {
    const response = await api.get<PublicArticle[]>(
      "/public/articles/popular",
      {
        params: { limit },
      }
    );
    return response.data;
  },

  async getRecentArticles(limit?: number): Promise<PublicArticle[]> {
    const response = await api.get<PublicArticle[]>("/public/articles/recent", {
      params: { limit },
    });
    return response.data;
  },

  async trackPageView(data: {
    pagePath: string;
    pageType: "home" | "category" | "article";
    articleId?: string;
  }): Promise<void> {
    await api.post("/public/track-view", data);
  },

  async recordFeedback(
    articleId: string,
    helpful: boolean
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      `/public/articles/${articleId}/feedback`,
      {
        helpful,
      }
    );
    return response.data;
  },
};
