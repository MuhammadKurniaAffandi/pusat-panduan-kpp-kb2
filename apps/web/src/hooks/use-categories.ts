import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  ApiErrorResponse,
} from "@/types";
import { AxiosError } from "axios";

/**
 * Hook untuk mengambil semua categories
 * PENTING: Backend default mengembalikan semua (aktif & nonaktif)
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
    staleTime: 30 * 1000, // 30 detik
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

/**
 * Hook untuk mengambil single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook untuk create category baru
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Panduan Layanan berhasil dibuat");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message || "Gagal membuat Panduan Layanan";
      toast.error(message);
    },
  });
}

/**
 * Hook untuk update category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoryService.update(id, data),
    onSuccess: async () => {
      // Invalidate dan refetch
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.refetchQueries({ queryKey: ["categories"] });
      toast.success("Panduan Layanan berhasil diupdate");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message || "Gagal mengupdate Panduan Layanan";
      toast.error(message);
    },
  });
}

/**
 * Hook untuk delete category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Panduan Layanan berhasil dihapus");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message || "Gagal menghapus Panduan Layanan";
      toast.error(message);
    },
  });
}
