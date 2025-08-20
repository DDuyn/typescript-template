import { TokenManager } from "@core/auth/token-manager";
import { isErr } from "@core/result/result";
import { cookieOptions } from "@core/types/cookie";
import { SupabaseAuthVerifier } from "@features/auth/infra/services/supabase-auth-verifier";
import { SupabaseTokenRefresher } from "@features/auth/infra/services/supabase-token-refresher";
import {
  SupabaseUserEnricher,
  UserEnricher,
} from "@features/auth/infra/services/supabase-user-enricher";
import { SupabaseAuthService } from "@features/auth/infra/services/supabase.service";
import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";

export interface AuthMiddlewareDependencies {
  tokenManager: TokenManager;
  userEnricher: UserEnricher;
}

export function createAuthMiddleware(
  deps: AuthMiddlewareDependencies
): MiddlewareHandler {
  return async (c, next) => {
    const accessToken = getCookie(c, "access_token");
    const refreshToken = getCookie(c, "refresh_token");

    if (!accessToken || !refreshToken) {
      return c.json({ ok: false, error: "Missing tokens" }, 401);
    }

    const result = await deps.tokenManager.validateOrRefresh(
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

    const enrichedUser = await deps.userEnricher.enrich(result.value.user);
    c.set("user", enrichedUser);

    return await next();
  };
}

export async function createRequireAuth(): Promise<MiddlewareHandler> {
  const { tokenManager, userEnricher } =
    await resolveAuthMiddlewareDependencies();

  return createAuthMiddleware({ tokenManager, userEnricher });
}

async function resolveAuthMiddlewareDependencies(): Promise<AuthMiddlewareDependencies> {
  // TODO: Implementar resolución desde composition
  // Por ahora mantenemos la implementación actual como fallback
  const { SupabaseAuthVerifier } = await import(
    "@features/auth/infra/services/supabase-auth-verifier"
  );
  const { SupabaseTokenRefresher } = await import(
    "@features/auth/infra/services/supabase-token-refresher"
  );
  const { SupabaseUserEnricher } = await import(
    "@features/auth/infra/services/supabase-user-enricher"
  );
  const { SupabaseAuthService } = await import(
    "@features/auth/infra/services/supabase.service"
  );

  const authVerifier = new SupabaseAuthVerifier();
  const tokenRefresher = new SupabaseTokenRefresher();
  const tokenManager = new TokenManager(authVerifier, tokenRefresher);
  const userEnricher = new SupabaseUserEnricher(new SupabaseAuthService());

  return { tokenManager, userEnricher };
}

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
