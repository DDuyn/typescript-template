import z from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_DB_URL: z.url(),
  SUPABASE_PROJECT_ID: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  APP_PORT: z.string().transform((port) => Number(port)),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error("Invalid environment variables.");
  if (error instanceof z.ZodError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
}

export { env };
