import { isErr } from "@core/result/result";
import { Context } from "hono";
import { signupRequestSchema } from "./signup.model";
import { signupService } from "./signup.service";

export const signupHandler = async (c: Context) => {
  const parsedResult = signupRequestSchema.safeParse(await c.req.json());

  if (!parsedResult.success) {
    return c.json({ ok: false, details: parsedResult.error }, 400);
  }

  const { email, password } = parsedResult.data;
  const result = await signupService(email, password);

  if (isErr(result)) {
    return c.json({ ok: false, error: result.error }, 500);
  }
  return c.json({ ok: true }, 201);
};
