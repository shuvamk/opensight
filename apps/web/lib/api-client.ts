import { getAuthToken, setAuthToken, clearAuthToken } from "./auth-token";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

const WEB_ORIGIN =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function getOAuthUrl(provider: "github" | "google"): string {
  // Google callback is on the web app (Authorized redirect URI: .../api/auth/callback/google)
  if (provider === "google") {
    return `${WEB_ORIGIN}/api/auth/google`;
  }
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

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { accessToken?: string };
  return data.accessToken ?? null;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
  retried = false,
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

  if (response.status === 401 && !retried && !path.startsWith("/auth/")) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      setAuthToken(newToken);
      return request<T>(method, path, body, options, true);
    }
    clearAuthToken();
  }

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
