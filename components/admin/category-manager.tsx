"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/forms/field-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from "@/lib/api/admin-actions";
import type { Category } from "@/types/domain";
import { categorySchema, type CategoryFormInput, type CategoryInput } from "@/types/forms";

type CategoryManagerProps = {
  categories: Category[];
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CategoryFormInput, unknown, CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: CategoryInput) {
    startTransition(async () => {
      const result = editingCategory
        ? await updateCategoryAction(editingCategory.id, values)
        : await createCategoryAction(values);

      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
          if (messages[0]) {
            setError(field as keyof CategoryInput, { message: messages[0] });
          }
        });
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setEditingCategory(null);
      reset({ name: "", description: "" });
    });
  }

  function editCategory(category: Category) {
    setEditingCategory(category);
    reset({
      name: category.name,
      description: category.description ?? "",
    });
  }

  function deleteCategory(categoryId: string) {
    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form className="space-y-4 rounded-lg border bg-card p-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <h2 className="text-lg font-semibold tracking-normal">
            {editingCategory ? "Edit category" : "Create category"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Categories power property type filters and landlord listing forms.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            className="flex w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {editingCategory ? "Save category" : "Create category"}
          </Button>
          {editingCategory ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingCategory(null);
                reset({ name: "", description: "" });
              }}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold tracking-normal">Existing categories</h2>
        </div>
        <div className="divide-y">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{category.name}</p>
                  <Badge variant="outline">Type</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description ?? "No description provided."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => editCategory(category)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCategory(category.id)}
                  disabled={isPending}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {categories.length === 0 ? (
            <div className="p-5 text-sm text-muted-foreground">No categories found.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
