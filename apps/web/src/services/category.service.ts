import api from "@/lib/api";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "@/types";

/**
 * Service untuk operasi CRUD Category
 * Synced dengan backend NestJS
 */
export const categoryService = {
  /**
   * Mengambil semua categories
   * Backend default: includeInactive=true (menampilkan semua)
   */
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },

  /**
   * Mengambil single category by ID
   */
  async getById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Membuat category baru
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await api.post<Category>("/categories", data);
    return response.data;
  },

  /**
   * Update category existing
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete category by ID
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  /**
   * Reorder categories
   */
  async reorder(categoryIds: string[]): Promise<Category[]> {
    const response = await api.put<Category[]>("/categories/reorder", {
      categoryIds,
    });
    return response.data;
  },
};
