"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useArticles,
  useDeleteArticle,
  usePublishArticle,
} from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Article } from "@/types";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { PageHeader } from "@/components/admin-panel";
import Link from "next/link";

export default function ArtikelPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: articlesData, isLoading } = useArticles({
    page,
    limit: 10,
    search,
    status,
    categoryId,
  });

  const { data: categories, refetch, isFetching } = useCategories();
  const deleteMutation = useDeleteArticle();
  const publishMutation = usePublishArticle();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? "" : value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === "all" ? "" : value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
      refetch();
    } catch (error) {
      // Error sudah di-handle di hook
      throw new Error(
        `Gagal menghapus informasi layanan: ${(error as Error).message}`
      );
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
    } catch (error) {
      // Error sudah di-handle di hook
      throw new Error(
        `Gagal mempublikasikan informasi layanan: ${(error as Error).message}`
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      draft: { variant: "secondary", label: "Draft" },
      published: { variant: "default", label: "Published" },
      archived: { variant: "outline", label: "Archived" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <PageHeader
            title="Manajemen Informasi Layanan"
            description="Kelola informasi layanan"
            action={
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                  />
                  {isFetching ? "Memuat..." : "Refresh"}
                </Button>
                <Link href="/article/create">
                  <Button>
                    <Plus />
                    Informasi Baru
                  </Button>
                </Link>
              </div>
            }
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari informasi layanan..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryId || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Panduan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Panduan</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading...
              </div>
            ) : !articlesData?.data.length ? (
              <div className="p-8 text-center text-muted-foreground">
                Tidak ada informasi layanan yang ditemukan
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Judul Informasi</TableHead>
                        <TableHead>Panduan Layanan</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Views</TableHead> */}
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articlesData.data.map((article: Article) => (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{article.title}</div>
                              {article.excerpt && (
                                <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                  {article.excerpt}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {article.category.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(article.status)}
                          </TableCell>
                          {/* <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{article.viewCount}</span>
                          </div>
                        </TableCell> */}
                          <TableCell className="text-sm text-muted-foreground">
                            {format(
                              new Date(article.createdAt),
                              "dd MMM yyyy",
                              {
                                locale: localeId,
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/article/${article.id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Lihat Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/article/edit/${article.id}`)
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {article.status === "draft" && (
                                  <DropdownMenuItem
                                    onClick={() => handlePublish(article.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                {article.status === "published" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(`/article/${article.id}`)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Lihat
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => setDeleteId(article.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {articlesData.meta.totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Halaman {articlesData.meta.page} dari{" "}
                      {articlesData.meta.totalPages}
                    </div>
                    <div className="flex gap-2">
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
                        disabled={page === articlesData.meta.totalPages}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Informasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Informasi yang dihapus tidak dapat dikembalikan. Apakah Anda
              yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
