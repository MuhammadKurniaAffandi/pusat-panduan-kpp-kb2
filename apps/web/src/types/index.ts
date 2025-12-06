// ===========================================
// USER TYPES
// ===========================================

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

export enum UserRole {
  admin = "admin",
  staff = "staff",
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  fullName?: string;
  role?: UserRole;
  avatarUrl?: string | null;
  isActive?: boolean;
}

// ===========================================
// CATEGORY TYPES (SYNCED WITH BACKEND)
// ===========================================

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

/**
 * DTO untuk Create Category - SYNC dengan backend CreateCategoryDto
 */
export interface CreateCategoryDto {
  name: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
}

/**
 * DTO untuk Update Category - SYNC dengan backend UpdateCategoryDto
 */
export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  articleCount: number;
}

// ===========================================
// ARTICLE TYPES
// ===========================================

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
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
  content: string;
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

// ===========================================
// GENERIC RESPONSE TYPES
// ===========================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

// ===========================================
// AUTH TYPES
// ===========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyResetTokenResponse {
  valid: boolean;
  email: string;
  message: string;
}
