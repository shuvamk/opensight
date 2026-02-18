import { getAuthToken } from "./auth-token";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

export function getOAuthUrl(provider: "github" | "google"): string {
  return `${API_BASE.endsWith("/api") ? API_BASE.replace(/\/api$/, "") : API_BASE}/api/auth/${provider}`;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function handleResponse(response: Response) {
  if (response.status === 401) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = `${API_URL}${path}`;
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const config: RequestOptions = {
    ...options,
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  return handleResponse(response);
}

export const apiClient = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),

  patch: <T = unknown>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ) => request<T>("PATCH", path, body, options),

  del: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
