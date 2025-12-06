"use client";

import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui.store";
import { useLogout } from "@/hooks/use-auth";
import Image from "next/image";

export function AdminHeader() {
  const { toggleSidebar } = useUIStore();
  const { mutate: logout } = useLogout();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Image
          src="/logo-kemenkeu-djp.png"
          alt="Logo Kementerian Keuangan"
          width={120}
          height={100}
          className="object-none"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
            Pusat Panduan
          </h1>
          <p className="text-sm opacity-90 hidden sm:block">
            KPP Pratama Jakarta Kebayoran Baru Dua
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => logout()}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </header>
  );
}
