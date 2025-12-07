"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm"; // Kita akan buat UserForm menjadi komponen terpisah
import { useUser } from "@/hooks/use-users";

// interface UserFormWrapperProps {
//   userId: string;
//   fullName: string; // Tambahkan prop ini untuk tampilan header
// }

export function UserFormWrapper({
  userId,
  fullName,
}: {
  userId: string;
  fullName: string;
}) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Hook ambil data user (di dalam Client Component)
  const { data: userData, isLoading, error } = useUser(id);

  // 1. Tampilkan Loading
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Tampilkan Error / Not Found
  if (error || !userData) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div className="text-center">
          <p className="font-semibold text-lg text-foreground">
            Gagal Memuat Data
          </p>
          <p className="text-sm">
            {(error as Error)?.message || "User tidak ditemukan."}
          </p>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
          <Button variant="default" onClick={() => router.push("/user")}>
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

  // 3. Render Form
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Edit User: {userData.fullName}
        </h1>
      </div>

      {/* UserForm adalah Client Component juga */}
      <UserForm initialData={userData} userId={id} />
    </div>
  );
}
