import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
import { adminUsers, adminSessions } from "@opensight/db";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "admin-secret-change-me"
);

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds
const COOKIE_NAME = "admin_session";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(adminUserId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000);

  await db.insert(adminSessions).values({
    adminUserId,
    tokenHash,
    expiresAt,
  });

  // Create a JWT that contains the session token
  const jwt = await new SignJWT({ token: tokenHash, sub: adminUserId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .setIssuedAt()
    .sign(JWT_SECRET);

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return { token: jwt, expiresAt };
}

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
    const tokenHash = payload.token as string;
    const adminUserId = payload.sub as string;

    // Verify session exists in DB and is not expired
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(
        and(
          eq(adminSessions.tokenHash, tokenHash),
          eq(adminSessions.adminUserId, adminUserId),
          gt(adminSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!session) {
      return null;
    }

    // Get admin user
    const [adminUser] = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        fullName: adminUsers.fullName,
        role: adminUsers.role,
        isActive: adminUsers.isActive,
      })
      .from(adminUsers)
      .where(and(eq(adminUsers.id, adminUserId), eq(adminUsers.isActive, true)))
      .limit(1);

    if (!adminUser) {
      return null;
    }

    return adminUser;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const [adminUser] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .limit(1);

  if (!adminUser) {
    return { error: "Invalid email or password" };
  }

  if (!adminUser.isActive) {
    return { error: "Account is disabled" };
  }

  const validPassword = await bcrypt.compare(password, adminUser.passwordHash);
  if (!validPassword) {
    return { error: "Invalid email or password" };
  }

  // Update last login
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(adminUsers.id, adminUser.id));

  // Create session
  await createSession(adminUser.id);

  return {
    user: {
      id: adminUser.id,
      email: adminUser.email,
      fullName: adminUser.fullName,
      role: adminUser.role,
    },
  };
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (sessionCookie?.value) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
      const tokenHash = payload.token as string;

      // Delete session from DB
      await db
        .delete(adminSessions)
        .where(eq(adminSessions.tokenHash, tokenHash));
    } catch {
      // Cookie invalid, just clear it
    }
  }

  cookieStore.delete(COOKIE_NAME);
}
