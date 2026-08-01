import type { UserRole } from "@/types/domain";

export type AuthSession = {
  id: string;
  email: string;
  role: UserRole;
  exp?: number;
};

export function decodeAuthToken(token: string | undefined): AuthSession | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as unknown;

    if (!isAuthSession(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function verifyAuthToken(token: string | undefined): Promise<AuthSession | null> {
  if (!token) {
    return null;
  }

  const session = decodeAuthToken(token);

  if (!session || isExpiredSession(session)) {
    return null;
  }

  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    return process.env.NODE_ENV === "production" ? null : session;
  }

  const isValid = await verifyHs256Signature(token, secret);
  return isValid ? session : null;
}

export function isExpiredSession(session: AuthSession) {
  if (!session.exp) {
    return false;
  }

  return session.exp * 1000 <= Date.now();
}

async function verifyHs256Signature(token: string, secret: string) {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  return crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signature),
    new TextEncoder().encode(`${header}.${payload}`),
  );
}

function base64UrlToBytes(value: string) {
  const binary = base64UrlDecode(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  if (typeof atob === "function") {
    return atob(padded);
  }

  return Buffer.from(padded, "base64").toString("utf-8");
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const role = candidate.role;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    (role === "TENANT" || role === "LANDLORD" || role === "ADMIN") &&
    (candidate.exp === undefined || typeof candidate.exp === "number")
  );
}
