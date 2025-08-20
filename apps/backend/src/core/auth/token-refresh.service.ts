import { err, ok, Result } from "@core/result/result";
import { supabaseService } from "@infra/db/supabase";

export class TokenRefreshService {
  async refresh(
    refreshToken: string
  ): Promise<Result<{ accessToken: string; refreshToken: string }, string>> {
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
