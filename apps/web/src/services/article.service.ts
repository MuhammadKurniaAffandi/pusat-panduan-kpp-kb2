import api from "@/lib/api";
import { Article, PaginatedResponse, PublicArticleDetail } from "@/types";

export const articleService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<PaginatedResponse<Article>> {
    const response = await api.get<PaginatedResponse<Article>>("/articles", {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<Article> {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },

  // ✅ NEW: Get article by slug (public)
  async getBySlug(slug: string): Promise<PublicArticleDetail> {
    const response = await api.get<PublicArticleDetail>(
      `/public/articles/${slug}`
    );
    return response.data;
  },

  async create(data: {
    title: string;
    categoryId: string;
    excerpt?: string;
    content: string;
    status?: string;
  }): Promise<Article> {
    const response = await api.post<Article>("/articles", data);
    return response.data;
  },

  async update(
    id: string,
    data: {
      title?: string;
      categoryId?: string;
      excerpt?: string;
      content?: string;
      status?: string;
    }
  ): Promise<Article> {
    const response = await api.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/articles/${id}`);
  },

  async publish(id: string): Promise<Article> {
    const response = await api.patch<Article>(`/articles/${id}/publish`);
    return response.data;
  },

  async archive(id: string): Promise<Article> {
    const response = await api.patch<Article>(`/articles/${id}/archive`);
    return response.data;
  },
};
