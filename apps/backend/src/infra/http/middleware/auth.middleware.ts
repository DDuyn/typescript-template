import { TokenManager } from "@core/auth/token-manager";
import { isErr } from "@core/result/result";
import { cookieOptions } from "@core/types/cookie";
import { SupabaseAuthVerifier } from "@features/auth/infra/services/supabase-auth-verifier";
import { SupabaseTokenRefresher } from "@features/auth/infra/services/supabase-token-refresher";
import { SupabaseUserEnricher } from "@features/auth/infra/services/supabase-user-enricher";
import { SupabaseAuthService } from "@features/auth/infra/services/supabase.service";
import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";

// TODO: Composición en el middleware (o mejor, en un composition file)
const authVerifier = new SupabaseAuthVerifier();
const tokenRefresher = new SupabaseTokenRefresher();
const tokenManager = new TokenManager(authVerifier, tokenRefresher);
const userEnricher = new SupabaseUserEnricher(new SupabaseAuthService());

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const accessToken = getCookie(c, "access_token");
  const refreshToken = getCookie(c, "refresh_token");

  if (!accessToken || !refreshToken) {
    return c.json({ ok: false, error: "Missing tokens" }, 401);
  }

  const result = await tokenManager.validateOrRefresh(
    accessToken,
    refreshToken
  );

  if (isErr(result)) {
    return c.json({ ok: false, error: result.error }, 401);
  }

  if (result.value.newTokens) {
    setCookie(
      c,
      "access_token",
      result.value.newTokens.accessToken,
      cookieOptions
    );
    setCookie(
      c,
      "refresh_token",
      result.value.newTokens.refreshToken,
      cookieOptions
    );
  }

  const enrichedUser = await userEnricher.enrich(result.value.user);
  c.set("user", enrichedUser);

  return await next();
};
