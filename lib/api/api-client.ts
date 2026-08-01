import { env } from "@/lib/env";

type QueryValue = string | number | boolean | null | undefined;

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  token?: string;
  query?: Record<string, QueryValue>;
  json?: unknown;
  formData?: FormData;
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getApiUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, env.NEXT_PUBLIC_API_BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { token, query, json, formData, headers, ...init } = options;
  const requestHeaders = new Headers(headers);

  if (json !== undefined && formData !== undefined) {
    throw new Error("Use either json or formData for an API request, not both.");
  }

  if (json !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path, query), {
    ...init,
    headers: requestHeaders,
    body: getRequestBody(json, formData),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new ApiError(getApiErrorMessage(payload, response.statusText), response.status, payload);
  }

  return payload as TResponse;
}

function getRequestBody(json: unknown, formData: FormData | undefined) {
  if (formData) {
    return formData;
  }

  return json === undefined ? undefined : JSON.stringify(json);
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getApiErrorMessage(payload: unknown, fallback: string) {
  if (isRecord(payload)) {
    const message = payload.message ?? payload.error;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallback || "Request failed";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
