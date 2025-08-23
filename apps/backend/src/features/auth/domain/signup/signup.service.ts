import { Result, err, ok } from "@core/result/result";
import { AuthContext } from "../auth.context";

export const signupService = async (
  email: string,
  password: string,
  authContext: AuthContext
): Promise<Result<true, string>> => {
  const result = await authContext.repository.signUp(email, password);

  if (!result) {
    return err("Failed to sign up");
  }

  return ok(true);
};
