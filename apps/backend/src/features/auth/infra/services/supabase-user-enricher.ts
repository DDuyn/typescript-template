import { AuthUser, UserEnricher } from "@core/auth/types";
import { SupabaseAuthService } from "./supabase.service";

export class SupabaseUserEnricher implements UserEnricher {
  constructor(private supabaseAuth: SupabaseAuthService) {}

  async enrich(user: AuthUser): Promise<AuthUser & { isAdmin: boolean }> {
    const isAdmin = await this.supabaseAuth.isAdmin(user.userId);
    return { ...user, isAdmin };
  }
}
