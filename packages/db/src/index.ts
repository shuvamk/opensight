import net from "net";
import dns from "dns";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Fix: Node.js happy eyeballs (autoSelectFamily) fails with Neon's IPv6
// addresses being unreachable. Force IPv4-only connections.
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamily(false);

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export * from "./schema";
export { eq, and, or, sql, desc, asc } from "drizzle-orm";
export type Database = typeof db;
