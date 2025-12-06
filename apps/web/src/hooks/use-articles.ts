import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { articleService } from "@/services/article.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
}) {
  // ✅ FIX: Filter out empty values
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== "" && value !== undefined && value !== null
        )
      )
    : undefined;

  return useQuery({
    queryKey: ["articles", cleanParams],
    queryFn: () => articleService.getAll(cleanParams),
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => articleService.getById(id),
    enabled: !!id,
  });
}

// ✅ NEW: Hook untuk public article by slug
export function usePublicArticle(slug: string) {
  return useQuery({
    queryKey: ["public-article", slug],
    queryFn: () => articleService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Informasi layanan berhasil dibuat!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || "Gagal membuat Informasi layanan";
      toast.error(message);
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof articleService.update>[1];
    }) => articleService.update(id, data),
    onSuccess: (data, variables) => {
      /* Perbaikan masalah content tidak bisa diambil,
    script ini yang menangani.
    dan menambahkan parameter data dan variables dalam function onSuccess, */
      // 1. Invalidate Query LIST (untuk halaman daftar /article)
      queryClient.invalidateQueries({ queryKey: ["articles", data] });
      // 2. Invalidate Query DETAIL (untuk halaman detail /article/[id])
      // Ini memastikan data yang sedang dilihat atau diedit diperbarui secara realtime.
      queryClient.invalidateQueries({ queryKey: ["article", variables.id] }); // 👈 BARIS KRUSIAL

      toast.success("Informasi layanan berhasil diupdate!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || "Gagal update Informasi layanan";
      toast.error(message);
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Informasi layanan berhasil dihapus!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || "Gagal hapus Informasi layanan";
      toast.error(message);
    },
  });
}

export function usePublishArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleService.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Informasi layanan berhasil dipublikasikan!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || "Gagal publikasikan Informasi layanan";
      toast.error(message);
    },
  });
}
