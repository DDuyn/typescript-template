import { AuthRepository } from "features/auth/infra/repositories/auth.repository";

export type AuthContext = {
  repository: AuthRepository;
};
