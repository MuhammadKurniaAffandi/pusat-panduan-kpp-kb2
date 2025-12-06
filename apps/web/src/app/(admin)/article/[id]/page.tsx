"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useArticle,
  usePublishArticle,
  useDeleteArticle,
} from "@/hooks/use-articles";
import { TiptapRenderer } from "@/components/editor/TiptapRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useState } from "react";
import { PageHeader } from "@/components/admin-panel";

export default function ViewArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: article, isLoading, error } = useArticle(articleId);
  const publishMutation = usePublishArticle();
  const deleteMutation = useDeleteArticle();

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(articleId);
    } catch (error) {
      // Error handled in hook
      throw new Error(
        `Gagal mempublikasikan informasi layanan: ${(error as Error).message}`
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(articleId);
      router.push("/article");
    } catch (error) {
      // Error handled in hook
      throw new Error(
        `Gagal menghapus informasi layanan: ${(error as Error).message}`
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-red-600 mb-4">
              <p className="text-lg font-semibold">
                Informasi layanan tidak ditemukan
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Informasi layanan yang Anda cari mungkin sudah dihapus atau
                tidak ada.
              </p>
            </div>
            <Button onClick={() => router.push("/article")}>
              Kembali ke Daftar Informasi Layanan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="hidden sm:block">
            <PageHeader
              title="Detail Informasi Layanan"
              description="Preview dan kelola informasi layanan"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/article/edit/${articleId}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {article.status === "draft" && (
            <Button
              onClick={handlePublish}
              disabled={publishMutation.isPending}
            >
              {publishMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
          {article.status === "published" && (
            <Button
              variant="outline"
              onClick={() =>
                window.open(`/informasi/${article.slug}`, "_blank")
              }
            >
              <Eye className="h-4 w-4 mr-2" />
              Lihat Publik
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informasi Layanan</CardTitle>
            {getStatusBadge(article.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Judul Informasi
                </div>
                <div className="font-medium">{article.title}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Slug</div>
                <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {article.slug}
                </div>
              </div>

              {article.excerpt && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Ringkasan
                  </div>
                  <div className="text-sm">{article.excerpt}</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Panduan Layanan
                  </div>
                  <div className="font-medium">{article.category.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Penulis</div>
                  <div className="font-medium">{article.author.fullName}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Dibuat pada
                  </div>
                  <div className="font-medium">
                    {format(
                      new Date(article.createdAt),
                      "dd MMMM yyyy, HH:mm",
                      {
                        locale: localeId,
                      }
                    )}
                  </div>
                </div>
              </div>

              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Dipublikasikan
                    </div>
                    <div className="font-medium">
                      {format(
                        new Date(article.publishedAt),
                        "dd MMMM yyyy, HH:mm",
                        { locale: localeId }
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Views</div>
                  <div className="font-medium">{article.viewCount}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview Konten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
            <TiptapRenderer content={article.content} />
          </div>
        </CardContent>
      </Card>

      {article.status === "published" && (
        <Card>
          <CardHeader>
            <CardTitle>Statistik Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {article.helpfulYes}
                </div>
                <div className="text-sm text-green-600">Helpful (Yes)</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {article.helpfulNo}
                </div>
                <div className="text-sm text-red-600">Not Helpful (No)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Informasi Layanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Informasi Layanan <strong>{article.title}</strong> akan dihapus
              secara permanen. Tindakan ini tidak dapat dibatalkan. Apakah Anda
              yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
