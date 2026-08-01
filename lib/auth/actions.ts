"use server";

import { redirect } from "next/navigation";

import { apiEndpoints } from "@/config/api-endpoints";
import { appRoutes } from "@/config/routes";
import { ApiError, apiRequest } from "@/lib/api/api-client";
import { clearAuthCookie, getRoleDashboardPath, setAuthCookie } from "@/lib/auth/session";
import type { AuthActionResult, AuthResponseData } from "@/lib/auth/types";
import type { ApiResponse } from "@/types/domain";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/types/forms";

export async function loginAction(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await apiRequest<ApiResponse<AuthResponseData>>(apiEndpoints.auth.login, {
      method: "POST",
      json: parsed.data,
      cache: "no-store",
    });

    await setAuthCookie(response.data.token);

    return {
      success: true,
      message: response.message,
      redirectTo: getRoleDashboardPath(response.data.role),
    };
  } catch (error) {
    return {
      success: false,
      message: getAuthErrorMessage(error),
    };
  }
}

export async function registerAction(input: RegisterInput): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await apiRequest<ApiResponse<AuthResponseData>>(apiEndpoints.auth.register, {
      method: "POST",
      json: parsed.data,
      cache: "no-store",
    });

    if (response.data.token) {
      await setAuthCookie(response.data.token);

      return {
        success: true,
        message: response.message,
        redirectTo: getRoleDashboardPath(response.data.role),
      };
    }

    return {
      success: true,
      message: response.message,
      redirectTo: appRoutes.login,
    };
  } catch (error) {
    return {
      success: false,
      message: getAuthErrorMessage(error),
    };
  }
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect(appRoutes.login);
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
}
