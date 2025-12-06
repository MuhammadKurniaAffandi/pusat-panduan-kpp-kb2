"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Folder, RefreshCw } from "lucide-react";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/admin-panel/PageHeader";
import { DynamicIcon } from "@/components/admin-panel/DynamicIcon";

type StatusFilter = "all" | "active" | "inactive";

export default function KategoriPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories, isLoading, refetch, isFetching } = useCategories();
  const deleteMutation = useDeleteCategory();

  // Filter categories
  const filteredCategories = categories?.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = cat.isActive === true;
    } else if (statusFilter === "inactive") {
      matchesStatus = cat.isActive === false;
    }

    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          refetch();
        },
      });
    }
  };

  // Counts
  const totalCount = categories?.length || 0;
  const activeCount =
    categories?.filter((c) => c.isActive === true).length || 0;
  const inactiveCount =
    categories?.filter((c) => c.isActive === false).length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <PageHeader
            title="Manajemen Panduan Layanan"
            description="Kelola panduan layanan"
            action={
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                  {isFetching ? "Memuat..." : "Refresh"}
                </Button>
                <Link href="/help/create">
                  <Button>
                    <Plus />
                    Panduan Baru
                  </Button>
                </Link>
              </div>
            }
          />
        </CardHeader>

        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari panduan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm pl-8"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua ({totalCount})</SelectItem>
                <SelectItem value="active">Aktif ({activeCount})</SelectItem>
                <SelectItem value="inactive">
                  Nonaktif ({inactiveCount})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info Badge */}
          {(search || statusFilter !== "all") && (
            <div className="mb-4">
              <Badge variant="outline" className="text-xs">
                Menampilkan {filteredCategories?.length || 0} dari {totalCount}{" "}
                kategori
              </Badge>
            </div>
          )}

          {/* Table */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Icon</TableHead>
                    <TableHead>Nama Panduan</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Deskripsi
                    </TableHead>
                    <TableHead className="text-center">Informasi</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!categories || categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <Folder className="h-16 w-16 mx-auto mb-3 opacity-30" />
                        <p className="text-base font-medium">
                          Belum ada kategori
                        </p>
                        <p className="text-sm mt-1">
                          Klik tombol &quot;Panduan Baru&quot; untuk membuat
                          kategori pertama
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <Search className="h-16 w-16 mx-auto mb-3 opacity-30" />
                        <p className="text-base font-medium">
                          Tidak ada kategori yang sesuai
                        </p>
                        <p className="text-sm mt-1">
                          {statusFilter === "active" &&
                            "Tidak ada kategori aktif"}
                          {statusFilter === "inactive" &&
                            "Tidak ada kategori nonaktif"}
                          {statusFilter === "all" &&
                            search &&
                            `Tidak ditemukan kategori dengan kata kunci "${search}"`}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories?.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <DynamicIcon
                              iconName={category.icon || undefined}
                              className="h-5 w-5 text-primary"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {category.description || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-md">
                          <div className="truncate text-sm text-muted-foreground">
                            {category.description || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="font-mono">
                            {category.articleCount || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              category.isActive ? "default" : "secondary"
                            }
                            className={
                              category.isActive
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-400 hover:bg-gray-500"
                            }
                          >
                            {category.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/help/edit/${category.id}`}>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(category.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Hapus</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Panduan Layanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Panduan Layanan yang memiliki
              artikel tidak dapat dihapus. Pastikan tidak ada informasi layanan
              di Panduan Layanan ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
