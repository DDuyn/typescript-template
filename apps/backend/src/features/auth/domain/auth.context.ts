import { FeatureContext } from "@core/types/feature-context";
import { AuthRepository } from "../infra/repositories/auth.repository";

export type AuthContext = FeatureContext<AuthRepository>;
