"use client";

import { useRouter } from "next/navigation";
import { useCreateCategory } from "@/hooks/use-categories";
import { CategoryForm } from "@/components/admin-panel/CategoryForm";
import { PageHeader } from "@/components/admin-panel/PageHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import type { CreateCategoryDto } from "@/types";

export default function CreateKategoriPage() {
  const router = useRouter();
  const createMutation = useCreateCategory();

  const handleSubmit = (data: CreateCategoryDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push("/help");
      },
    });
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
        <PageHeader title="Panduan Baru" />
      </div>

      <Card>
        <CardHeader>
          <PageHeader
            title="Data Panduan Layanan"
            description="Isi detail untuk membuat panduan baru."
          />
        </CardHeader>

        <CategoryForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          cancelHref="/help"
        />
      </Card>
    </div>
  );
}
