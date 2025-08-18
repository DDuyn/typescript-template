import { Result } from "@core/result/result";
import { AuthUser } from "./types";

export interface AuthVerifier {
  verify(authorizationHeader: string | null): Promise<Result<AuthUser, string>>;
}
