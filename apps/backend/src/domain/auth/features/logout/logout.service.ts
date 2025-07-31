import { supabaseAuth } from "@core/auth/auth.service";
import { err, ok, Result } from "@core/result/result";

export const logoutService = async (
  refreshToken: string
): Promise<Result<true, string>> => {
  const res = await supabaseAuth.logout(refreshToken);

  if (!res) {
    return err("Failed to logout");
  }

  return ok(true);
};
