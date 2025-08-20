import { CompositionBuilder } from "@core/di/composition-builder";
import { recoverPasswordHandler } from "@domain/auth/features/recover-password/recover-password.handler";
import { signupHandler } from "@domain/auth/features/signup/signup.handler";
import { RouteBuilder } from "@infra/http/routes/route-builder";
import { Hono } from "hono";
import { loginHandler } from "../api/login/login.handler";
import { authRoutes } from "./auth.routes";
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

export function buildAuthComposition() {
  const builder = new CompositionBuilder();
  builder
    .registerSingleton("supabaseAuthService", () => new SupabaseAuthService())
    .registerSingleton(
      "authRepository",
      () =>
        new AuthRepository(builder.build().resolveSync("supabaseAuthService"))
    )
    .registerSingleton("authContext", () => ({
      repository: builder.build().resolveSync("authRepository"),
    }))
    .registerSingleton("authRouter", () =>
      RouteBuilder.buildRoutes(
        authRoutes,
        builder.build().resolveSync("authContext")
      )
    );

  return builder.build();
}
