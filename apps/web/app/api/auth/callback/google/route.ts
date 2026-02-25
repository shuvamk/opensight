import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const errorRedirect = () =>
    NextResponse.redirect(`${origin}/auth/callback?error=authentication_failed`);

  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return errorRedirect();
    }

    if (!code) {
      return errorRedirect();
    }

    // Optional: verify state cookie for CSRF
    const stateCookie = request.cookies.get("oauth_state")?.value;
    if (stateCookie && state !== stateCookie) {
      return errorRedirect();
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error(
        "[Google callback] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in apps/web env"
      );
      return NextResponse.json(
        { error: "Google OAuth is not configured" },
        { status: 503 }
      );
    }

    const redirectUri = `${origin}/api/auth/callback/google`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", tokenRes.status, tokenText);
      return errorRedirect();
    }

    let tokenData: { id_token?: string };
    try {
      tokenData = JSON.parse(tokenText) as { id_token?: string };
    } catch {
      console.error("Google token response not JSON:", tokenText.slice(0, 200));
      return errorRedirect();
    }

    const idToken = tokenData.id_token;
    if (!idToken) {
      console.error("Google response missing id_token");
      return errorRedirect();
    }

    // Exchange id_token for app JWT via API
    const apiRes = await fetch(`${API_URL}/auth/google/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const apiText = await apiRes.text();
    if (!apiRes.ok) {
      console.error("API google token failed:", apiRes.status, apiText);
      return errorRedirect();
    }

    let data: { accessToken?: string };
    try {
      data = JSON.parse(apiText) as { accessToken?: string };
    } catch {
      console.error("API response not JSON:", apiText.slice(0, 200));
      return errorRedirect();
    }

    const accessToken = data.accessToken;
    if (!accessToken) {
      return errorRedirect();
    }

    // Redirect to app callback page so client can set auth cookie and go to dashboard
    const redirectUrl = new URL(`${origin}/auth/callback`);
    redirectUrl.searchParams.set("accessToken", accessToken);
    redirectUrl.searchParams.set("provider", "google");

    const res = NextResponse.redirect(redirectUrl.toString());
    res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });
    return res;
  } catch (err) {
    console.error("[Google callback] Unhandled error:", err);
    return errorRedirect();
  }
}
