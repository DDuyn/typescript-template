import { AuthRepository } from "../infra/repositories/auth.repository";

export type AuthContext = {
  repository: AuthRepository;
};
