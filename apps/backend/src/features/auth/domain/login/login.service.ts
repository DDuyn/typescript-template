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
      await authContext.logger.logAuth("failed_login", undefined, email);
      await authContext.metrics.metricAuth("failed_login", email);
      return err("Invalid credentials");
    }

    const isAdmin = await authContext.repository.findIsAdmin(data.user.id);
    await authContext.logger.logAuth("login", data.user.id, email);
    await authContext.metrics.metricAuth("login", email);

    return ok({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expires_in: data.session.expires_in,
      userId: data.user.id,
      email: data.user.email!,
      isAdmin,
    });
  } catch (error) {
    await authContext.logger.error(
      "Login service error",
      { error: error instanceof Error ? error.message : error },
      undefined
    );
    return err(error instanceof Error ? error.message : "Unknown error");
  }
}
