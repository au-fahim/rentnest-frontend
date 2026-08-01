"use client";

import { dashboardHomeByRole } from "@/config/routes";
import { appRoutes } from "@/config/routes";
import type { AuthActionResult, AuthResponseData, RegisterResponseData } from "@/lib/auth/types";
import type { ApiResponse, UserRole } from "@/types/domain";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/types/forms";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://rent-nest-backend-lilac.vercel.app";

export async function loginWithBackend(input: LoginInput): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return authenticateLogin(parsed.data);
}

export async function registerWithBackend(input: RegisterInput): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return authenticateRegister(parsed.data);
}

async function authenticateLogin(payload: LoginInput): Promise<AuthActionResult> {
  try {
    const backendResponse = await fetch(new URL("/api/auth/login", apiBaseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const backendPayload = (await backendResponse.json()) as Partial<ApiResponse<AuthResponseData>>;

    if (!backendResponse.ok || !backendPayload.success || !backendPayload.data?.token) {
      return {
        success: false,
        message: getResponseMessage(backendPayload, "Authentication failed. Check your credentials."),
      };
    }

    const sessionResponse = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: backendPayload.data.token }),
    });
    const sessionPayload = (await sessionResponse.json()) as {
      success?: boolean;
      message?: string;
      data?: { role?: UserRole };
    };

    if (!sessionResponse.ok || !sessionPayload.success || !sessionPayload.data?.role) {
      return {
        success: false,
        message: sessionPayload.message ?? "Session could not be saved. Please try again.",
      };
    }

    return {
      success: true,
      message: backendPayload.message ?? "Authenticated successfully.",
      redirectTo: dashboardHomeByRole[sessionPayload.data.role],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `Authentication request failed: ${error.message}`
          : "Authentication request failed. Please try again.",
    };
  }
}

async function authenticateRegister(payload: RegisterInput): Promise<AuthActionResult> {
  try {
    const backendResponse = await fetch(new URL("/api/auth/register", apiBaseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const backendPayload = (await backendResponse.json()) as Partial<ApiResponse<RegisterResponseData>>;

    if (!backendResponse.ok || !backendPayload.success || !backendPayload.data?.id) {
      return {
        success: false,
        message: getResponseMessage(backendPayload, "Registration failed. Please try again."),
      };
    }

    return {
      success: true,
      message: backendPayload.message ?? "Registration completed successfully.",
      redirectTo: appRoutes.login,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `Registration request failed: ${error.message}`
          : "Registration request failed. Please try again.",
    };
  }
}

function getResponseMessage(payload: Partial<ApiResponse<unknown>>, fallback: string) {
  return typeof payload.message === "string" && payload.message.trim().length > 0
    ? payload.message
    : fallback;
}
