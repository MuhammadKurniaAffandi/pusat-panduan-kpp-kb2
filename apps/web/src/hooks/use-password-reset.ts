// apps/web/src/hooks/use-password-reset.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { ForgotPasswordRequest, ResetPasswordRequest } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

/**
 * Hook untuk Forgot Password
 */
export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
    onSuccess: (response) => {
      toast.success("Email Terkirim!", {
        description: response.message,
        duration: 5000,
      });

      // Optional: redirect ke halaman info
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ||
        "Gagal mengirim email reset password. Silakan coba lagi.";
      toast.error("Gagal Mengirim Email", {
        description: message,
      });
    },
  });
}

/**
 * Hook untuk Verify Reset Token
 */
export function useVerifyResetToken(token: string) {
  return useQuery({
    queryKey: ["verify-reset-token", token],
    queryFn: () => authService.verifyResetToken(token),
    enabled: !!token && token.length > 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook untuk Reset Password
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (response) => {
      toast.success("Password Berhasil Direset!", {
        description: response.message,
        duration: 5000,
      });

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ||
        "Gagal reset password. Token mungkin sudah kadaluarsa.";
      toast.error("Gagal Reset Password", {
        description: message,
      });
    },
  });
}
