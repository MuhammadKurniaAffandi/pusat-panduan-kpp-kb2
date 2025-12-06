"use client";

import { useRouter, useParams } from "next/navigation";
import { useCategory, useUpdateCategory } from "@/hooks/use-categories";
import { CategoryForm } from "@/components/admin-panel/CategoryForm";
import { PageHeader } from "@/components/admin-panel/PageHeader";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { UpdateCategoryDto } from "@/types";

export default function EditKategoriPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: category, isLoading } = useCategory(id);
  const updateMutation = useUpdateCategory();

  const handleSubmit = (data: UpdateCategoryDto) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/help");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Panduan Layanan tidak ditemukan</p>
      </div>
    );
  }

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
        <PageHeader title="Edit Panduan" />
      </div>

      <Card>
        <CardHeader>
          <PageHeader
            title="Data Panduan Layanan"
            description="Perbarui detail informasi panduan ini"
          />
        </CardHeader>

        <CategoryForm
          mode="edit"
          defaultValues={{
            name: category.name,
            description: category.description || "",
            icon: category.icon || "Folder",
            isActive: category.isActive,
          }}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          cancelHref="/help"
        />
      </Card>
    </div>
  );
}
