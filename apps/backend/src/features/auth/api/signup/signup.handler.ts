import { isErr } from "@core/result/result";
import { Context } from "hono";

import { AuthContext } from "@features/auth/domain/auth.context";
import { signupService } from "@features/auth/domain/signup/signup.service";
import { signupRequestSchema } from "./signup.request";

export const signupHandler = async (c: Context, authContext: AuthContext) => {
  const parsedResult = signupRequestSchema.safeParse(await c.req.json());

  if (!parsedResult.success) {
    return c.json({ ok: false, details: parsedResult.error }, 400);
  }

  const { email, password } = parsedResult.data;
  const result = await signupService(email, password, authContext);

  if (isErr(result)) {
    return c.json({ ok: false, error: result.error }, 500);
  }
  return c.json({ ok: true }, 201);
};
