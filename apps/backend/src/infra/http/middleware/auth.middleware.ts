import { isErr } from "@core/result/result";
import { cookieOptions } from "@core/types/cookie";
import { createAuthDependencies } from "@features/auth/infra/auth.composition";
import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";

let authDeps: ReturnType<typeof createAuthDependencies> | null = null;

function getAuthDependencies() {
  if (!authDeps) {
    authDeps = createAuthDependencies();
  }
  return authDeps;
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const { tokenManager, userEnricher } = getAuthDependencies();

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
