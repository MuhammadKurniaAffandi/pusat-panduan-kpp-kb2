export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "staff";
  avatarUrl?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  displayOrder: number;
  isActive: boolean;
  articleCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: Record<string, unknown>;
  featuredImageUrl?: string | null;
  status: "draft" | "published" | "archived";
  publishedAt?: string | null;
  viewCount: number;
  helpfulYes: number;
  helpfulNo: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    fullName: string;
    email?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  articleCount: number;
}

export interface PublicArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  viewCount: number;
  featuredImageUrl?: string | null;
  category?: {
    name: string;
    slug: string;
  };
}

export interface PublicArticleDetail {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: Record<string, unknown>;
  featuredImageUrl?: string | null;
  publishedAt?: string | null;
  viewCount: number;
  helpfulYes: number;
  helpfulNo: number;
  author: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}
