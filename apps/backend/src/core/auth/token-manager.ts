import { err, isErr, isOk, ok, Result } from "@core/result/result";
import { AuthVerifier } from "./auth-verifier";
import { AuthUser, TokenPair, TokenRefresher } from "./types";

export class TokenManager {
  constructor(
    private authVerifier: AuthVerifier,
    private tokenRefresher: TokenRefresher
  ) {}

  async validateOrRefresh(
    accessToken: string,
    refreshToken: string
  ): Promise<Result<{ user: AuthUser; newTokens: TokenPair | null }, string>> {
    let result = await this.authVerifier.verify(`Bearer ${accessToken}`);

    if (isErr(result)) {
      const refreshResult = await this.tokenRefresher.refresh(refreshToken);

      if (isErr(refreshResult)) {
        return err("Failed to refresh session");
      }

      result = await this.authVerifier.verify(
        `Bearer ${refreshResult.value.accessToken}`
      );

      return isOk(result)
        ? ok({ user: result.value, newTokens: refreshResult.value })
        : result;
    }

    return ok({ user: result.value, newTokens: null });
  }
}
