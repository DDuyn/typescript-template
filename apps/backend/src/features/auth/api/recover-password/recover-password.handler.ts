import { isErr } from "@core/result/result";
import { AuthContext } from "@features/auth/domain/auth.context";
import { recoverPasswordService } from "@features/auth/domain/recover-password/recover-password.service";
import { Context } from "hono";
import { recoverPasswordRequestSchema } from "./recover-password.request";

export const recoverPasswordHandler = async (
  c: Context,
  authContext: AuthContext
) => {
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

  const result = await recoverPasswordService(
    parsedResult.data.email,
    authContext
  );

  if (isErr(result)) {
    return c.json({ ok: false, error: result.error }, 500);
  }

  return c.json({ ok: true });
};
