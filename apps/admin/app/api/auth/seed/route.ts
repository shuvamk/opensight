import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@opensight/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// POST /api/auth/seed — Creates the initial admin user
// This endpoint should be disabled in production or protected further
// Requires: email, password, fullName
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (body === null || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const { email, password, fullName } = body;

    // Reject if email or password (or fullName) are missing
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedFullName = typeof fullName === "string" ? fullName.trim() : "";
    if (!trimmedEmail) {
      return NextResponse.json(
        { success: false, error: "email is required" },
        { status: 400 },
      );
    }
    if (!password || (typeof password === "string" && password.trim() === "")) {
      return NextResponse.json(
        { success: false, error: "password is required" },
        { status: 400 },
      );
    }
    if (!trimmedFullName) {
      return NextResponse.json(
        { success: false, error: "fullName is required" },
        { status: 400 },
      );
    }

    // Check if admin already exists
    const [existing] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, trimmedEmail.toLowerCase()))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Admin user already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(
      typeof password === "string" ? password : String(password),
      12,
    );

    const [newAdmin] = await db
      .insert(adminUsers)
      .values({
        email: trimmedEmail.toLowerCase(),
        passwordHash,
        fullName: trimmedFullName,
        role: "super_admin",
      })
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        fullName: adminUsers.fullName,
        role: adminUsers.role,
      });

    return NextResponse.json(
      { success: true, user: newAdmin },
      { status: 201 },
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
