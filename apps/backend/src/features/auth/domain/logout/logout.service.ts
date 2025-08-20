import { err, ok, Result } from "@core/result/result";
import { AuthContext } from "../auth.context";

export const logoutService = async (
  accessToken: string,
  authContext: AuthContext
): Promise<Result<true, string>> => {
  const result = await authContext.repository.logout(accessToken);

  if (!result) {
    return err("Failed to logout");
  }

  return ok(true);
};
