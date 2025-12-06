"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useArticle, useUpdateArticle } from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, RefreshCw, Save, Send } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HelpEditor } from "@/components/editor";
import { PageHeader } from "@/components/admin-panel";

const articleSchema = z.object({
  title: z.string().min(5, "Nama Informasi Layanan minimal 5 karakter"),
  categoryId: z.string().min(1, "Panduan Layanan harus dipilih"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Konten tidak boleh kosong"),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function EditArtikelPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: article, isLoading } = useArticle(articleId);
  const { data: categories, refetch, isFetching } = useCategories();
  const updateMutation = useUpdateArticle();

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || "",
      categoryId: article?.category.id || "",
      excerpt: article?.excerpt || "",
      content: article?.content || "",
      status: article?.status || "draft",
    },
  });

  // Load article data
  useEffect(() => {
    if (article && categories) {
      form.reset({
        title: article?.title || "",
        categoryId: article?.category.id || "",
        excerpt: article?.excerpt || "",
        content: article?.content || "",
        status: article?.status || "draft",
      });
    }
  }, [article, form, categories]);

  const onSubmit = async (data: ArticleFormData, newStatus?: string) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        status: newStatus || data.status,
        excerpt: data.excerpt || undefined,
      };

      await updateMutation.mutateAsync({
        id: articleId,
        data: payload,
      });

      router.push("/article");
    } catch (error) {
      // Error handled in hook
      throw new Error(
        `Gagal mengupdate informasi layanan: ${(error as Error).message}`
      );
    } finally {
      setIsSubmitting(false);
      refetch();
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Informasi layanan tidak ditemukan
          </h2>
          <Button onClick={() => router.back()} className="mt-4">
            Kembali
          </Button>
        </div>
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
        </Button>
        <PageHeader
          title="Edit Informasi Layanan"
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
              {/* <Link href="/article/create">
                  <Button>
                    <Plus />
                    Informasi Baru
                  </Button>
                </Link> */}
            </div>
          }
        />
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <PageHeader
                    title="Data Informasi Layanan"
                    description="Perbarui detail informasi layanan ini"
                  />
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Informasi Layanan *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Cara Daftar NPWP Online"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ringkasan (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ringkasan singkat informasi layanan (maks 200 karakter)"
                            rows={3}
                            maxLength={200}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ringkasan akan ditampilkan di daftar informasi layanan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Konten informasi layanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <HelpEditor
                            key={articleId}
                            content={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Panduan Layanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilih Panduan Layanan *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Panduan Layanan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={form.handleSubmit((data) =>
                      onSubmit(data, "draft")
                    )}
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan sebagai Draft
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={form.handleSubmit((data) =>
                      onSubmit(data, "published")
                    )}
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {article.status === "published"
                      ? "Update & Publish"
                      : "Publish Informasi"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
