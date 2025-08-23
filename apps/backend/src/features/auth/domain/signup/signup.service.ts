import { Result, err, ok } from "@core/result/result";
import { supabaseService } from "infra/db/supabase";

export const signupService = async (
  email: string,
  password: string
): Promise<Result<true, string>> => {
  const { data, error } = await supabaseService.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) return err("Failed to sign up");

  const profileInsert = await supabaseService
    .from("profiles")
    .insert({ user_id: data.user.id, is_admin: false });

  if (profileInsert.error) return err("Failed to create profile");

  return ok(true);
};
