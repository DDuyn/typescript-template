import { supabasePublic } from "@core/db/supabase";
import { err, ok, Result } from "@core/result/result";
import { eq } from "drizzle-orm";
import { db } from "infra/db/drizzle";
import { profiles } from "infra/db/schema/profile.schema";
import { LoginDto } from "./login.model";

export async function loginService(
  email: string,
  password: string
): Promise<Result<LoginDto, string>> {
  const { data, error } = await supabasePublic.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    return err("Invalid credentials");
  }

  const { isAdmin } = await db
    .select({ isAdmin: profiles.isAdmin })
    .from(profiles)
    .where(eq(profiles.user_id, data.user.id))
    .limit(1)
    .then((result) => result[0]);

  return ok({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expires_in: data.session.expires_in,
    userId: data.user.id,
    email: data.user.email!,
    isAdmin,
  });
}
