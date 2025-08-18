import { err, ok, Result } from "@core/result/result";
import { LoginDto } from "../../../../features/auth/domain/login/login.model";
import { AuthContext } from "../auth.context";

export async function loginService(
  email: string,
  password: string,
  authContext: AuthContext
): Promise<Result<LoginDto, string>> {
  try {
    const { data, error } = await authContext.repository.signInWithEmail(
      email,
      password
    );

    if (error || !data.session || !data.user) {
      return err("Invalid credentials");
    }

    const isAdmin = await authContext.repository.findIsAdmin(data.user.id);

    return ok({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expires_in: data.session.expires_in,
      userId: data.user.id,
      email: data.user.email!,
      isAdmin,
    });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Unknown error");
  }
}
