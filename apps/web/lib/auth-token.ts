const AUTH_TOKEN_KEY = "auth_token";
const MAX_AGE_DAYS = 30;

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_TOKEN_KEY}=`));
  if (!match) return null;
  try {
    return decodeURIComponent(match.split("=")[1] ?? "");
  } catch {
    return null;
  }
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
}
