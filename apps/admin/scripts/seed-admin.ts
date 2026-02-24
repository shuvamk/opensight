/**
 * Seed script to create the initial admin user.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts <email> <password> [fullName] [seedSecret]
 *
 * Example (first user):
 *   npx tsx scripts/seed-admin.ts admin@opensight.dev 'opensight#12@' "OpenSight Admin"
 *
 * Or via the API (recommended — validates seed secret):
 *   curl -X POST http://localhost:3001/api/auth/seed \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"admin@opensight.dev","password":"opensight#12@","fullName":"OpenSight Admin","seedSecret":"YOUR_JWT_SECRET_FROM_ENV"}'
 */

import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import { adminUsers } from "@opensight/db";
import { eq } from "drizzle-orm";

function fail(message: string, code = 1): never {
  console.error(JSON.stringify({ success: false, error: message }));
  process.exit(code);
}

async function main() {
  const email = process.argv[2]?.trim();
  const password = process.argv[3];
  const fullName = process.argv[4]?.trim() || "OpenSight Admin";
  const seedSecret = process.argv[5];

  if (!email) {
    fail("email is required");
  }
  if (!password || password.trim() === "") {
    fail("password is required");
  }

  const expectedSecret = process.env.JWT_SECRET;
  if (seedSecret !== undefined && expectedSecret !== undefined && seedSecret !== expectedSecret) {
    fail("Invalid seed secret", 1);
  }

  if (!process.env.DATABASE_URL) {
    fail("DATABASE_URL is not set", 1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  const [existing] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase()))
    .limit(1);

  if (existing) {
    await client.end();
    fail("Admin user already exists", 1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [newAdmin] = await db
    .insert(adminUsers)
    .values({
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role: "super_admin",
    })
    .returning();

  await client.end();

  console.log(
    JSON.stringify({
      success: true,
      user: newAdmin,
    }),
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(JSON.stringify({ success: false, error: err?.message ?? "Unknown error" }));
  process.exit(1);
});
