import { Result } from "@core/result/result";
import { AuthVerifier } from "./auth-verifier";
import { AuthUser } from "./types";

export class AuthService {
  constructor(private readonly authVerifier: AuthVerifier) {}

  async verifyToken(
    authorizationHeader: string | null
  ): Promise<Result<AuthUser, string>> {
    return this.authVerifier.verify(authorizationHeader);
  }
}
