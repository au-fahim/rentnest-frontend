import { revalidatePath } from "next/cache";

import { apiEndpoints } from "@/config/api-endpoints";
import { appRoutes } from "@/config/routes";
import { apiRequest } from "@/lib/api/api-client";
import { getAuthToken } from "@/lib/auth/session";
import type { ApiResponse, Category, Property, RentalRequest, User } from "@/types/domain";
import type { CategoryInput } from "@/types/forms";

export async function getAdminUsers() {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<User[]>>(apiEndpoints.admin.users, {
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function updateAdminUserStatus(userId: string, isBanned: boolean) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<User>>(apiEndpoints.admin.updateUser(userId), {
    method: "PATCH",
    token,
    json: { isBanned },
    cache: "no-store",
  });

  revalidatePath(appRoutes.adminDashboard);
  revalidatePath(appRoutes.adminUsers);
  return response;
}

export async function createCategory(input: CategoryInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Category>>(apiEndpoints.categories.create, {
    method: "POST",
    token,
    json: {
      name: input.name,
      description: input.description || null,
    },
    cache: "no-store",
  });

  revalidateCategoryViews();
  return response;
}

export async function updateCategory(categoryId: string, input: CategoryInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Category>>(apiEndpoints.categories.update(categoryId), {
    method: "PATCH",
    token,
    json: {
      name: input.name,
      description: input.description || null,
    },
    cache: "no-store",
  });

  revalidateCategoryViews();
  return response;
}

export async function deleteCategory(categoryId: string) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<unknown>>(apiEndpoints.categories.delete(categoryId), {
    method: "DELETE",
    token,
    cache: "no-store",
  });

  revalidateCategoryViews();
  return response;
}

export async function getAdminProperties() {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Property[]>>(apiEndpoints.admin.properties, {
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function getAdminRentals() {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<RentalRequest[]>>(apiEndpoints.admin.rentals, {
    token,
    cache: "no-store",
  });

  return response.data;
}

async function getRequiredToken() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You must be signed in.");
  }

  return token;
}

function revalidateCategoryViews() {
  revalidatePath(appRoutes.adminCategories);
  revalidatePath(appRoutes.properties);
  revalidatePath(appRoutes.landlordPropertyCreate);
}
