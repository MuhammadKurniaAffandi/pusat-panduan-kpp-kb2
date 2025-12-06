"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { AdminSidebar } from "@/components/admin-panel/Sidebar";
import { AdminHeader } from "@/components/admin-panel/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, checkAuth, setLoading } =
    useAuthStore();
  // const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // setMounted(true);

    const verifyAuth = async () => {
      // Check auth saat mount
      const hasAuth = checkAuth();

      if (!hasAuth) {
        router.push(`/auth/login?from=${pathname}`);
      } else {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [checkAuth, pathname, router, setLoading]);

  // Prevent hydration mismatch
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background-alt">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
