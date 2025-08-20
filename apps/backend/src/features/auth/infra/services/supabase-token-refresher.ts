import { TokenPair, TokenRefresher } from "@core/auth/types";
import { err, ok, Result } from "@core/result/result";
import { supabaseService } from "@infra/db/supabase";

export class SupabaseTokenRefresher implements TokenRefresher {
  async refresh(refreshToken: string): Promise<Result<TokenPair, string>> {
    const { data, error } = await supabaseService.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (!data?.session || error) {
      return err("Failed to refresh session");
    }

    return ok({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  }
}
