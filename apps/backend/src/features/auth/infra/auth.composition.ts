import { recoverPasswordHandler } from "@domain/auth/features/recover-password/recover-password.handler";
import { signupHandler } from "@domain/auth/features/signup/signup.handler";
import { Hono } from "hono";
import { loginHandler } from "../api/login/login.handler";
import { AuthRepository } from "./repositories/auth.repository";
import { SupabaseAuthService } from "./services/supabase.service";

export function authComposition() {
  const supabaseAuthService = new SupabaseAuthService();
  const authRepository = new AuthRepository(supabaseAuthService);
  const authContext = { repository: authRepository };
  const authRouter = new Hono();

  authRouter.post("/login", async (c) => loginHandler(c, authContext));
  authRouter.post("/refresh-token", async (c) => loginHandler(c, authContext));

  authRouter.post("/recover-password", recoverPasswordHandler);
  authRouter.post("/signup", signupHandler);

  return authRouter;
}
