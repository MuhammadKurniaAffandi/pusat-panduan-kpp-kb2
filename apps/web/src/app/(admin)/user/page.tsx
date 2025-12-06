"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@/types";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Trash, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/admin-panel";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Hook untuk mengambil data users dengan pagination/search
  const { data: usersData, isLoading } = useUsers({
    page,
    limit: 10,
    search,
  });

  // Hook untuk menghapus user
  const deleteMutation = useDeleteUser();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset ke halaman 1 saat search
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      // Kita akan gunakan soft delete (menonaktifkan) di sini untuk keamanan
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      toast.error(`Gagal menonaktifkan user ${(error as Error).message}`);
    }
  };

  const getUserRoleBadge = (role: string) => {
    const isStaff = role === "staff";
    return (
      <Badge variant={isStaff ? "secondary" : "default"}>
        {isStaff ? "Staff" : "Admin"}
      </Badge>
    );
  };

  const getUserStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "destructive"}>
        {isActive ? "Aktif" : "Nonaktif"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <PageHeader
            title="Manajemen Users"
            description="Kelola daftar pengguna sistem KPP Help Center"
            action={
              <Link href="/user/create">
                <Button>
                  <Plus />
                  User Baru
                </Button>
              </Link>
            }
          />
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari email atau nama lengkap..."
                className="max-w-sm pl-8"
                defaultValue={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading...
              </div>
            ) : !usersData?.data.length ? (
              <div className="p-8 text-center text-muted-foreground">
                Tidak ada user ditemukan
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData.data.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{user.fullName}</div>
                            {user.avatarUrl && (
                              <div className="text-xs text-muted-foreground">
                                {user.avatarUrl}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.email}
                          </TableCell>
                          <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                          <TableCell>
                            {getUserStatusBadge(user.isActive)}
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/user/edit/${user.id}`}>
                                  <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  onClick={() => setDeleteId(user.id)}
                                  className="text-destructive focus:text-destructive"
                                  disabled={!user.isActive} // Nonaktifkan tombol delete jika user sudah nonaktif
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  {user.isActive
                                    ? "Nonaktifkan"
                                    : "Sudah Nonaktif"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {usersData.meta.totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Halaman {usersData.meta.page} dari{" "}
                      {usersData.meta.totalPages}
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === usersData.meta.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete/Deactivate Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan User?</AlertDialogTitle>
            <AlertDialogDescription>
              User akan dinonaktifkan (Status *Aktif* akan menjadi *Nonaktif*).
              Apakah Anda yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
