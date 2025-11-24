import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { LoginRequest } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success("Login berhasil!");
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || "Login gagal. Coba lagi.";
      toast.error(message);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      toast.success("Logout berhasil");
      router.push("/auth/login");
    },
    onError: () => {
      clearAuth();
      router.push("/auth/login");
    },
  });
}

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
  };
}
