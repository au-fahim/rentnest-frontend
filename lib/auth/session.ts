import { cookies } from "next/headers";
import { cache } from "react";

import { apiEndpoints } from "@/config/api-endpoints";
import { appRoutes } from "@/config/routes";
import { apiRequest } from "@/lib/api/api-client";
import { authCookieMaxAgeSeconds, authCookieName } from "@/lib/auth/auth-constants";
import { verifyAuthToken } from "@/lib/auth/jwt";
import type { AuthResponseData, AuthUser } from "@/lib/auth/types";
import type { ApiResponse, UserRole } from "@/types/domain";

type AuthCookieStore = Awaited<ReturnType<typeof cookies>>;

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: authCookieMaxAgeSeconds,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(authCookieName);
}

export async function getAuthToken(cookieStore?: AuthCookieStore) {
  const store = cookieStore ?? (await cookies());
  return store.get(authCookieName)?.value;
}

export const getCurrentSession = cache(async () => {
  const token = await getAuthToken();
  return verifyAuthToken(token);
});

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const response = await apiRequest<ApiResponse<AuthUser>>(apiEndpoints.users.profile, {
      token,
      cache: "no-store",
    });

    return response.data;
  } catch {
    if (process.env.NODE_ENV === "development") {
      const session = await verifyAuthToken(token);

      if (session) {
        return {
          id: session.id,
          name: session.email,
          email: session.email,
          role: session.role,
        };
      }
    }

    return null;
  }
});

export function getRoleDashboardPath(role: UserRole) {
  if (role === "ADMIN") {
    return appRoutes.adminDashboard;
  }

  if (role === "LANDLORD") {
    return appRoutes.landlordDashboard;
  }

  return appRoutes.tenantDashboard;
}

export function normalizeAuthResponse(data: AuthResponseData) {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
  } satisfies AuthUser;
}
