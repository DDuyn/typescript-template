import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infra/db/schema",
  schemaFilter: ["public"],
  out: "./src/infra/db/migrations",
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
  },
  entities: {
    roles: {
      provider: "supabase",
    },
  },
});
