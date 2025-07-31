import { isErr } from "@core/result/result";
import { Context } from "hono";
import { recoverPasswordRequestSchema } from "./recover-password.model";
import { recoverPasswordService } from "./recover-password.service";

export const recoverPasswordHandler = async (c: Context) => {
  const body = await c.req.json();
  const parsedResult = recoverPasswordRequestSchema.safeParse(body);

  if (!parsedResult.success) {
    return c.json(
      {
        error: "Invalid request",
        details: parsedResult.error,
      },
      400
    );
  }

  const result = await recoverPasswordService(parsedResult.data.email);

  if (isErr(result)) {
    return c.json({ ok: false, error: result.error }, 500);
  }

  return c.json({ ok: true });
};
