import { api } from "@/lib/api";
import { MessageResponse } from "@/types";

// Payload untuk Forgot Password
interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<MessageResponse> => {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
};

// Payload untuk Reset Password
interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<MessageResponse> => {
  const response = await api.post("/auth/reset-password", payload);
  return response.data;
};
