"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { useCreateUser } from "@/hooks/use-users";
import { UserRole } from "@/types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { CreateUserDto } from "@/types"; // Gunakan DTO dari types Anda
import { toast } from "sonner";
import { PageHeader } from "@/components/admin-panel";

export default function CreateUserPage() {
  const router = useRouter();
  const createUserMutation = useCreateUser();
  const [formData, setFormData] = useState<
    Omit<CreateUserDto, "role"> & { role: string }
  >({
    email: "",
    password: "",
    fullName: "",
    role: UserRole.staff, // Default role
    avatarUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as UserRole,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Pastikan role dikirim sebagai enum UserRole
      await createUserMutation.mutateAsync({
        ...formData,
        role: formData.role as UserRole,
      });
      router.push("/user"); // Redirect kembali ke daftar user
    } catch (error) {
      // Error sudah di-handle di hook (toast.error)
      toast.error(`Gagal membuat user baru ${(error as Error).message}`);
    }
  };

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
        <PageHeader title="User Baru" />
      </div>

      <Card>
        <CardHeader>
          <PageHeader
            title="Data User"
            description="Isi detail untuk membuat akun user baru"
          />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@kpp-kb2.go.id"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role" className="capitalize">
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.admin} className="capitalize">
                      {UserRole.admin}
                    </SelectItem>
                    <SelectItem value={UserRole.staff} className="capitalize">
                      {UserRole.staff}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">URL Avatar (Opsional)</Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatarUrl || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={createUserMutation.isPending}
                onClick={() => router.back()}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
