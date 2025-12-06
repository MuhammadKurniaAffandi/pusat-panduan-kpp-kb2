"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { IconSelector } from "./IconSelector";
import Link from "next/link";
import { useEffect } from "react";
import type { CreateCategoryDto, UpdateCategoryDto } from "@/types";

// ============================================
// SCHEMAS
// ============================================

const createCategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon harus dipilih"),
});

const updateCategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon harus dipilih"),
  isActive: z.boolean(),
});

type CreateFormData = z.infer<typeof createCategorySchema>;
type UpdateFormData = z.infer<typeof updateCategorySchema>;

// ============================================
// PROPS - Discriminated Union
// ============================================

type CategoryFormProps =
  | {
      mode: "create";
      onSubmit: (data: CreateCategoryDto) => void;
      defaultValues?: never;
      isLoading?: boolean;
      cancelHref?: string;
    }
  | {
      mode: "edit";
      onSubmit: (data: UpdateCategoryDto) => void;
      defaultValues: UpdateFormData;
      isLoading?: boolean;
      cancelHref?: string;
    };

// ============================================
// COMPONENT
// ============================================

export function CategoryForm(props: CategoryFormProps) {
  const { mode, onSubmit, isLoading, cancelHref = "/help" } = props;

  const form = useForm<CreateFormData | UpdateFormData>({
    resolver: zodResolver(
      mode === "create" ? createCategorySchema : updateCategorySchema
    ),
    defaultValues:
      mode === "create"
        ? {
            name: "",
            description: "",
            icon: "Folder",
          }
        : props.defaultValues,
  });

  // Update form when defaultValues change (edit mode)
  useEffect(() => {
    if (mode === "edit") {
      form.reset(props.defaultValues);
    }
  }, [mode, form, props.defaultValues]);

  const handleSubmit = (data: CreateFormData | UpdateFormData) => {
    if (mode === "create") {
      // Remove isActive if exists (shouldn't, but type-safe)
      const { name, description, icon } = data;
      onSubmit({ name, description, icon });
    } else {
      // Edit mode - include isActive
      onSubmit(data as UpdateCategoryDto);
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Panduan *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pendaftaran NPWP"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Icon Field */}
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon *</FormLabel>
                    <FormControl>
                      <IconSelector
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi singkat tentang panduan ini"
                    rows={3}
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isActive Field - Only Edit Mode */}
          {mode === "edit" && (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Status Aktif</FormLabel>
                    <FormDescription>
                      Panduan aktif akan tampil di halaman publik
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan"
                  : "Simpan Perubahan"}
            </Button>
            <Link href={cancelHref}>
              <Button type="button" variant="outline" disabled={isLoading}>
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </CardContent>
  );
}
