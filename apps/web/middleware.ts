import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/settings", "/onboarding", "/prompts", "/competitors", "/content-score", "/alerts"];
const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("auth_token");

  // Logged-in users visiting login/register etc. -> dashboard
  if (authPages.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    if (authCookie?.value) {
      const from = request.nextUrl.searchParams.get("from");
      return NextResponse.redirect(new URL(from && from.startsWith("/") ? from : "/dashboard", request.url));
    }
  }

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !authCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
