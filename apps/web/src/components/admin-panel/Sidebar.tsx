"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  FileText,
  Users,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin", "staff"],
  },
  {
    icon: Folder,
    label: "Panduan Layanan",
    href: "/help",
    roles: ["admin"],
  },
  {
    icon: FileText,
    label: "Informasi Layanan",
    href: "/article",
    roles: ["admin", "staff"],
  },
  { icon: Users, label: "Users", href: "/user", roles: ["admin"] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  console.log("Sidebar pathname:", pathname);
  const {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebar,
    toggleCollapse,
    closeSidebar,
  } = useUIStore();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-primary text-white transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-light">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <span className="font-bold text-primary text-sm">KPP</span>
              </div>
              <span className="font-semibold text-sm">Admin Panel</span>
            </div>
          )}

          {/* Toggle Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-white hover:bg-primary-light"
              onClick={toggleCollapse}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform",
                  sidebarCollapsed && "rotate-180"
                )}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-primary-light"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  "hover:bg-primary-light",
                  isActive ? "bg-primary-light" : "text-white/80",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {!sidebarCollapsed && user && (
          <div className="p-4 border-t border-primary-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-white/60">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
