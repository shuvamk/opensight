import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@opensight/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Default seed admin — use these when body is empty or fields omitted
const DEFAULT_SEED = {
  email: "admin@opensight.dev",
  password: "opensight#12@",
  fullName: "OpenSight Admin",
};

// POST /api/auth/seed — Creates the initial admin user
// This endpoint should be disabled in production or protected further
// POST with { "seedSecret": "<JWT_SECRET>" } to create default admin (admin@opensight.dev / opensight#12@)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      email = DEFAULT_SEED.email,
      password = DEFAULT_SEED.password,
      fullName = DEFAULT_SEED.fullName,
      seedSecret,
    } = body;

    // Require a seed secret to prevent unauthorized seeding
    if (seedSecret !== process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email?.trim() || !password || !fullName?.trim()) {
      return NextResponse.json(
        { error: "email, password, and fullName are required" },
        { status: 400 },
      );
    }

    // Check if admin already exists
    const [existing] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newAdmin] = await db
      .insert(adminUsers)
      .values({
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName,
        role: "super_admin",
      })
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        fullName: adminUsers.fullName,
        role: adminUsers.role,
      });

    return NextResponse.json({ user: newAdmin }, { status: 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
