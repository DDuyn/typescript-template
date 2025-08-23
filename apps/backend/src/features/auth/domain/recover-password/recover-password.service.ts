import { err, ok, Result } from "@core/result/result";
import { AuthContext } from "../auth.context";

export const recoverPasswordService = async (
  email: string,
  authContext: AuthContext
): Promise<Result<true, string>> => {
  const { error } = await authContext.repository.recoverPassword(email);
  if (error) {
    return err(error.message);
  }

  return ok(true);
};
