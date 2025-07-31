import { supabaseService } from "@core/db/supabase";
import { isErr, isOk } from "@core/result/result";
import { cookieOptions } from "@core/types/cookie";
import { MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { supabaseAuth } from "./auth.service";
import { verifySupabaseJWT } from "./verify-jwt";

export const requireAuth: MiddlewareHandler = async (c, next) => {
  let accessToken = getCookie(c, "access_token");
  const refreshToken = getCookie(c, "refresh_token");

  if (!accessToken || !refreshToken) {
    return c.json(
      { ok: false, error: "UNAUTHORIZED", message: "Missing token" },
      401
    );
  }

  let result = await verifySupabaseJWT(accessToken);

  if (isErr(result)) {
    const { data, error } = await supabaseService.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (!data?.session || error) {
      return c.json(
        {
          ok: false,
          error: "UNAUTHORIZED",
          message: "Failed to refresh session",
        },
        401
      );
    }

    accessToken = data.session.access_token;
    setCookie(c, "access_token", accessToken, cookieOptions);

    result = await verifySupabaseJWT(accessToken);
  }

  if (isOk(result)) {
    const isAdmin = await supabaseAuth.isAdmin(result.value.userId);
    c.set("user", { ...result.value, isAdmin });
    return await next();
  }

  return c.json(
    { ok: false, error: "UNAUTHORIZED", message: result.error },
    401
  );
};
