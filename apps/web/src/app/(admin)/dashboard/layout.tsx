// import { AdminSidebar } from "@/components/admin/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* <AdminSidebar /> */}
      <main className="flex-1 p-8 bg-background-alt">{children}</main>
    </div>
  );
}
