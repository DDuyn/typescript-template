import { isErr } from "@core/result/result";
import { cookieOptions } from "@core/types/cookie";
import { AuthContext } from "@features/auth/domain/auth.context";
import { loginService } from "@features/auth/domain/login/login.service";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { loginRequestSchema } from "./login.request";
import { LoginResponse } from "./login.response";

export const loginHandler = async (c: Context, authContext: AuthContext) => {
  const body = await c.req.json();

  const parseResult = loginRequestSchema.safeParse(body);

  if (!parseResult.success) {
    return c.json(
      {
        error: "Invalid request",
        details: parseResult.error,
      },
      400
    );
  }

  const { email, password } = parseResult.data;
  const result = await loginService(email, password, authContext);

  if (isErr(result)) {
    return c.json({ error: result.error }, 401);
  }

  const response: LoginResponse = {
    accessToken: result.value.accessToken,
    refreshToken: result.value.refreshToken,
    expires_in: result.value.expires_in ?? 0,
    userId: result.value.userId,
    email: result.value.email,
    isAdmin: result.value.isAdmin,
  };

  setCookie(c, "access_token", response.accessToken, cookieOptions);
  setCookie(c, "refresh_token", response.refreshToken, cookieOptions);

  return c.json(response);
};
