import api from "@/lib/api";
import { LoginRequest, AuthResponse, User } from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.post<{ user: User }>("/auth/me");
    return response.data;
  },
};
