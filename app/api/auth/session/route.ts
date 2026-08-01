import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { authCookieMaxAgeSeconds, authCookieName } from "@/lib/auth/auth-constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

const sessionRequestSchema = z.object({
  token: z.string().min(20),
});

export async function POST(request: NextRequest) {
  const parsed = sessionRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid session payload." },
      { status: 400 },
    );
  }

  const session = await verifyAuthToken(parsed.data.token);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired authentication token." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Session saved successfully.",
    data: {
      role: session.role,
    },
  });

  response.cookies.set(authCookieName, parsed.data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: authCookieMaxAgeSeconds,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Session cleared successfully.",
  });

  response.cookies.delete(authCookieName);
  return response;
}
