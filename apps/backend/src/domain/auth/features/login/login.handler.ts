import { isErr } from "@core/result/result";
import { cookieOptions } from "@core/types/cookie";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { loginRequestSchema } from "./login.model";
import { loginService } from "./login.service";

export const loginHandler = async (c: Context) => {
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
  const result = await loginService(email, password);

  if (isErr(result)) {
    return c.json({ error: result.error }, 401);
  }

  const { accessToken, refreshToken } = result.value;

  setCookie(c, "access_token", accessToken, cookieOptions);
  setCookie(c, "refresh_token", refreshToken, cookieOptions);

  return c.json({ token: result.value });
};
