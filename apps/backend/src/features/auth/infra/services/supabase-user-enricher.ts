import { AuthUser } from "@core/auth/types";
import { SupabaseAuthService } from "./supabase.service";

export interface UserEnricher {
  enrich(user: AuthUser): Promise<AuthUser & { isAdmin: boolean }>;
}

export class SupabaseUserEnricher implements UserEnricher {
  constructor(private supabaseAuth: SupabaseAuthService) {}

  async enrich(user: AuthUser): Promise<AuthUser & { isAdmin: boolean }> {
    const isAdmin = await this.supabaseAuth.isAdmin(user.userId);
    return { ...user, isAdmin };
  }
}
