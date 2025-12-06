import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "staff";
  avatarUrl?: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken, refreshToken) => {
        // Simpan token di cookie (untuk SSR/middleware)
        Cookies.set("accessToken", accessToken, {
          expires: 1 / 96, // 15 menit
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        Cookies.set("refreshToken", refreshToken, {
          expires: 7, // 7 hari
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        // Simpan juga di localStorage (untuk axios interceptor)
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
        }

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearAuth: () => {
        // Hapus cookie
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        // Hapus dari localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      checkAuth: () => {
        const token = Cookies.get("accessToken");
        return !!token;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
