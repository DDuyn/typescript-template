import { CompositionBuilder } from "@core/di/composition-builder";
import { RouteBuilder } from "@infra/http/routes/route-builder";
import { Hono } from "hono";
import { AuthContext } from "../domain/auth.context";
import { authRoutes } from "./auth.routes";
import { AuthRepository } from "./repositories/auth.repository";
import { SupabaseAuthService } from "./services/supabase.service";

export const AUTH_COMPOSITION_KEYS = {
  SUPABASE_AUTH_SERVICE: "supabaseAuthService",
  AUTH_REPOSITORY: "authRepository",
  AUTH_CONTEXT: "authContext",
  AUTH_ROUTER: "authRouter",
} as const;

export function buildAuthComposition() {
  return new CompositionBuilder()
    .registerSingleton(
      AUTH_COMPOSITION_KEYS.SUPABASE_AUTH_SERVICE,
      () => new SupabaseAuthService()
    )

    .registerSingletonWithDeps(
      AUTH_COMPOSITION_KEYS.AUTH_REPOSITORY,
      [AUTH_COMPOSITION_KEYS.SUPABASE_AUTH_SERVICE],
      (supabaseService: SupabaseAuthService) =>
        new AuthRepository(supabaseService)
    )

    .registerSingletonWithDeps(
      AUTH_COMPOSITION_KEYS.AUTH_CONTEXT,
      [AUTH_COMPOSITION_KEYS.AUTH_REPOSITORY],
      (repository: AuthRepository): AuthContext => ({ repository })
    )

    .registerSingletonWithDeps(
      AUTH_COMPOSITION_KEYS.AUTH_ROUTER,
      [AUTH_COMPOSITION_KEYS.AUTH_CONTEXT],
      (context: AuthContext): Hono =>
        RouteBuilder.buildRoutes(authRoutes, context)
    )

    .build();
}

export async function createAuthRouter(): Promise<Hono> {
  const composition = buildAuthComposition();
  return await composition.resolve<Hono>(AUTH_COMPOSITION_KEYS.AUTH_ROUTER);
}
