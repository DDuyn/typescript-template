import { TokenManager } from "@core/auth/token-manager";
import {
  getLogger,
  getMetrics,
} from "@features/monitoring/infra/monitoring.composition";
import { AuthContext } from "../domain/auth.context";
import { AuthRepository } from "./repositories/auth.repository";
import { SupabaseAuthVerifier } from "./services/supabase-auth-verifier";
import { SupabaseTokenRefresher } from "./services/supabase-token-refresher";
import { SupabaseUserEnricher } from "./services/supabase-user-enricher";
import { SupabaseAuthService } from "./services/supabase.service";

export function createAuthDependencies() {
  const supabaseAuthService = new SupabaseAuthService();
  const authRepository = new AuthRepository(supabaseAuthService);
  const authVerifier = new SupabaseAuthVerifier();
  const tokenRefresher = new SupabaseTokenRefresher();
  const tokenManager = new TokenManager(authVerifier, tokenRefresher);
  const userEnricher = new SupabaseUserEnricher(supabaseAuthService);

  return {
    authRepository,
    authVerifier,
    tokenManager,
    userEnricher,
    supabaseAuthService,
  };
}

export function createAuthContext(): AuthContext {
  const { authRepository } = createAuthDependencies();
  return {
    repository: authRepository,
    logger: getLogger(),
    metrics: getMetrics(),
  };
}
