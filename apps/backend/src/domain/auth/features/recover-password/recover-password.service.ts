import { supabaseService } from "@core/db/supabase";
import { err, ok, Result } from "@core/result/result";

export const recoverPasswordService = async (
  email: string
): Promise<Result<true, string>> => {
  const { error } = await supabaseService.auth.resetPasswordForEmail(email);
  if (error) {
    return err(error.message);
  }

  return ok(true);
};
