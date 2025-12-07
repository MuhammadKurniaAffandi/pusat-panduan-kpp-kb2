"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpdateUser } from "@/hooks/use-users";
import { UserRole, UpdateUserDto, User } from "@/types";
import { PageHeader } from "../PageHeader";

interface UserFormProps {
  initialData: User;
  userId: string;
}

export function UserForm({ initialData, userId }: UserFormProps) {
  const router = useRouter();
  const updateUserMutation = useUpdateUser();

  // State diinisialisasi LANGSUNG dari props
  const [formData, setFormData] = useState<UpdateUserDto>({
    email: initialData.email,
    password: "",
    fullName: initialData.fullName,
    role: initialData.role as UserRole,
    avatarUrl: initialData.avatarUrl,
    isActive: initialData.isActive,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.id === "password" && value === "") {
      setFormData((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = prev;
        return rest;
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData };

    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        data: dataToSend,
      });
      router.push("/user");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <PageHeader
          title="Data User"
          description="Perbarui detail informasi pengguna ini."
        />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* ... (Isi Form seperti sebelumnya) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName || ""}
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
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">
                Password (Biarkan kosong jika tidak diubah)
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Isi untuk mengubah password"
                onChange={handleChange}
                minLength={6}
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
                    Admin
                  </SelectItem>
                  <SelectItem value={UserRole.staff} className="capitalize">
                    Staff
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

          <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Status Aktif
              </Label>
              <CardDescription>
                Nonaktifkan user ini untuk mencegah login.
              </CardDescription>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleActiveChange}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={updateUserMutation.isPending}
              onClick={() => router.back()}
            >
              Batal
            </Button>
          </div>
          {/* <Button
            type="submit"
            className="w-full"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button> */}
        </form>
      </CardContent>
    </Card>
  );
}
