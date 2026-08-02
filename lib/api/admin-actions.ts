"use server";

import { ApiError } from "@/lib/api/api-client";
import { createCategory, deleteCategory, updateAdminUserStatus, updateCategory } from "@/lib/api/admin-services";
import { categorySchema, type CategoryInput } from "@/types/forms";

type AdminMutationResult =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

export async function updateUserStatusAction(userId: string, isBanned: boolean) {
  try {
    const response = await updateAdminUserStatus(userId, isBanned);
    return { success: true, message: response.message };
  } catch (error) {
    if (error instanceof ApiError || error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Could not update user status." };
  }
}

export async function createCategoryAction(input: CategoryInput): Promise<AdminMutationResult> {
  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return getAdminMutationResult(() => createCategory(parsed.data));
}

export async function updateCategoryAction(
  categoryId: string,
  input: CategoryInput,
): Promise<AdminMutationResult> {
  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return getAdminMutationResult(() => updateCategory(categoryId, parsed.data));
}

export async function deleteCategoryAction(categoryId: string): Promise<AdminMutationResult> {
  return getAdminMutationResult(() => deleteCategory(categoryId));
}

async function getAdminMutationResult(
  mutation: () => Promise<{ message: string }>,
): Promise<AdminMutationResult> {
  try {
    const response = await mutation();
    return { success: true, message: response.message };
  } catch (error) {
    if (error instanceof ApiError || error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Admin action could not be completed." };
  }
}
