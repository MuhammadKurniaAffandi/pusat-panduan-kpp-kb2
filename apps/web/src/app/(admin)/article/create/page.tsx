"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateArticle } from "@/hooks/use-articles";
import { useCategories } from "@/hooks/use-public";
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
import { ChevronLeft, Save, Send } from "lucide-react";
import { HelpEditor } from "@/components/editor";
import { PageHeader } from "@/components/admin-panel";

const articleSchema = z.object({
  title: z.string().min(5, "Nama Informasi Layanan minimal 5 karakter"),
  categoryId: z.string().min(1, "Panduan Layanan harus dipilih"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Konten tidak boleh kosong"),
  status: z.enum(["draft", "published"]).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function CreateArtikelPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories } = useCategories();
  const createMutation = useCreateArticle();

  // console.log(categories);
  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      excerpt: "",
      content: "",
      status: "draft",
    },
  });

  const onSubmit = async (data: ArticleFormData, isDraft: boolean = true) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        status: isDraft ? ("draft" as const) : ("published" as const),
        excerpt: data.excerpt || undefined,
      };

      await createMutation.mutateAsync(payload);
      router.push("/article");
    } catch (error) {
      // Error handled in hook
      throw new Error(
        `Gagal membuat informasi layanan: ${(error as Error).message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          className="h-7 w-7"
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Informasi Layanan Baru" />
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <PageHeader
                    title="Data Informasi Layanan"
                    description="Isi detail untuk membuat informasi baru"
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
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Tulis Informasi Layanan di sini..."
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
                        <FormLabel>Panduan Layanan *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                    onClick={form.handleSubmit((data) => onSubmit(data, true))}
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan sebagai Draft
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={form.handleSubmit((data) => onSubmit(data, false))}
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish Informasi
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
