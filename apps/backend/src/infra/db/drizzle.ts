import { env } from "@core/env/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const client = postgres(env.SUPABASE_DB_URL, { prepare: false });
export const db = drizzle(client);
