import { isErr } from "@core/result/result";
import { AuthContext } from "@features/auth/domain/auth.context";
import { logoutService } from "@features/auth/domain/logout/logout.service";
import { Context } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";

export const logoutHandler = async (c: Context, authContext: AuthContext) => {
  const accessToken = getCookie(c, "access_token");

  if (!accessToken) {
    return c.json({ ok: false, error: "No access token found." }, 400);
  }

  const result = await logoutService(accessToken, authContext);
  deleteCookie(c, "refresh_token", { path: "/api" });
  deleteCookie(c, "access_token", { path: "/api" });

  if (isErr(result)) {
    return c.json({ ok: false, error: result.error }, 500);
  }

  return c.json({ ok: true });
};
