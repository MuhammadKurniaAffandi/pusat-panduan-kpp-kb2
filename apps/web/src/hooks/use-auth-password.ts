import { useMutation } from "@tanstack/react-query";
import { forgotPassword, resetPassword } from "@/lib/auth.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Hook untuk Forgot Password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      // Backend kita selalu merespons sukses untuk alasan keamanan
      toast.success(data.message, {
        description: "Silakan cek email Anda untuk tautan reset.",
        duration: 8000,
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat meminta reset password.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });
};

// Hook untuk Reset Password
export const useResetPassword = (onSuccessCallback: () => void) => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success("Berhasil!", {
        description: data.message,
      });
      onSuccessCallback(); // Panggil callback (misalnya, redirect ke Login)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message ||
        "Terjadi kesalahan saat mereset password.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });
};
