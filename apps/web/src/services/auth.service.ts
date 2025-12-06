import api from "@/lib/api";
import {
  LoginRequest,
  AuthResponse,
  User,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyResetTokenResponse,
} from "@/types";

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

  // ============================================
  // PASSWORD RESET METHODS (NEW)
  // ============================================

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  },

  async verifyResetToken(token: string): Promise<VerifyResetTokenResponse> {
    const response = await api.get<VerifyResetTokenResponse>(
      `/auth/verify-reset-token/${token}`
    );
    return response.data;
  },

  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data
    );
    return response.data;
  },
};
