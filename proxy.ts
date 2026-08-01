import { NextResponse, type NextRequest } from "next/server";

import { appRoutes, dashboardHomeByRole, protectedRouteAccess } from "@/config/routes";
import { authCookieName } from "@/lib/auth/auth-constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

const authRoutes: readonly string[] = [appRoutes.login, appRoutes.register];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(authCookieName)?.value;
  const validSession = await verifyAuthToken(token);
  const matchedProtectedRoute = protectedRouteAccess.find((route) =>
    pathname.startsWith(route.prefix),
  );

  if (matchedProtectedRoute && !validSession) {
    const loginUrl = new URL(appRoutes.login, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (matchedProtectedRoute && validSession && !matchedProtectedRoute.roles.includes(validSession.role)) {
    return NextResponse.redirect(new URL(dashboardHomeByRole[validSession.role], request.url));
  }

  if (validSession && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(dashboardHomeByRole[validSession.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/auth/login", "/auth/register"],
};
