import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { yieldcastSql?: ReturnType<typeof postgres> };

export function databaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  return url ? url : null;
}

export function getDb(): Database | null {
  const url = databaseUrl();
  if (!url) return null;
  const sql = globalForDb.yieldcastSql ?? postgres(url, { prepare: false, max: 1 });
  globalForDb.yieldcastSql = sql;
  return drizzle(sql, { schema });
}
