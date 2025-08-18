import { AuthVerifier } from "@core/auth/auth-verifier";
import { AuthUser } from "@core/auth/types";
import { env } from "@core/env/env";
import { err, ok, Result } from "@core/result/result";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

export class SupabaseAuthVerifier implements AuthVerifier {
  async verify(
    authorizationHeader: string | null
  ): Promise<Result<AuthUser, string>> {
    if (!authorizationHeader) return err("No token provided");
    if (!authorizationHeader.startsWith("Bearer "))
      return err("No Bearer token provided");

    const token = authorizationHeader.replace("Bearer ", "");

    try {
      const { payload } = await jwtVerify(token, JWKS);

      if (!payload.sub || !payload.email) {
        return err("Token payload missing user id (sub)");
      }

      return ok({
        userId: String(payload.sub),
        email: String(payload.email),
        role: typeof payload.role === "string" ? payload.role : undefined,
      });
    } catch (e) {
      return err(
        "Invalid or expired token " +
          (e instanceof Error ? e.message : String(e))
      );
    }
  }
}
