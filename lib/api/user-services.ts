import { revalidatePath } from "next/cache";

import { apiEndpoints } from "@/config/api-endpoints";
import { appRoutes } from "@/config/routes";
import { apiRequest } from "@/lib/api/api-client";
import { getAuthToken } from "@/lib/auth/session";
import type { AuthUser } from "@/lib/auth/types";
import type { ApiResponse } from "@/types/domain";
import type { ProfileInput } from "@/types/forms";

export async function updateProfile(input: ProfileInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<AuthUser>>(apiEndpoints.users.profile, {
    method: "PATCH",
    token,
    json: input,
    cache: "no-store",
  });

  revalidatePath(appRoutes.profile);
  revalidatePath("/dashboard");
  return response;
}

async function getRequiredToken() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You must be signed in.");
  }

  return token;
}
