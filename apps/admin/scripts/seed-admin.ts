/**
 * Seed script to create the initial admin user.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Or via the API:
 *   curl -X POST http://localhost:3001/api/auth/seed \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *       "email": "admin@opensight.com",
 *       "password": "your-password",
 *       "fullName": "Admin User",
 *       "seedSecret": "<your JWT_SECRET from .env>"
 *     }'
 */

import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import { adminUsers } from "@opensight/db";
import { eq } from "drizzle-orm";

const EMAIL = process.argv[2] || "admin@opensight.com";
const PASSWORD = process.argv[3] || "admin123!";
const FULL_NAME = process.argv[4] || "Super Admin";

async function main() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  console.log(`Creating admin user: ${EMAIL}`);

  const [existing] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, EMAIL))
    .limit(1);

  if (existing) {
    console.log("Admin user already exists!");
    await client.end();
    return;
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  const [newAdmin] = await db
    .insert(adminUsers)
    .values({
      email: EMAIL,
      passwordHash,
      fullName: FULL_NAME,
      role: "super_admin",
    })
    .returning();

  console.log("Admin user created:", {
    id: newAdmin.id,
    email: newAdmin.email,
    fullName: newAdmin.fullName,
    role: newAdmin.role,
  });

  await client.end();
}

main().catch(console.error);
