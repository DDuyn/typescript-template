import { Result } from "@core/result/result";

export type AuthUser = {
  userId: string;
  email: string;
  role?: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export interface TokenRefresher {
  refresh(refreshToken: string): Promise<Result<TokenPair, string>>;
}

export interface UserEnricher {
  enrich(user: AuthUser): Promise<AuthUser & { isAdmin: boolean }>;
}
