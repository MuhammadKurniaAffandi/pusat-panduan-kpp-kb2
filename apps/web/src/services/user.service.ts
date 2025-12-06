import api from "@/lib/api";
import { User, PaginatedResponse } from "@/types";

export const userService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: {
    email: string;
    password: string;
    fullName: string;
    role: "admin" | "staff";
  }): Promise<User> {
    const response = await api.post<User>("/users", data);
    return response.data;
  },

  async update(
    id: string,
    data: {
      email?: string;
      password?: string;
      fullName?: string;
      role?: "admin" | "staff";
      isActive?: boolean;
    }
  ): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
