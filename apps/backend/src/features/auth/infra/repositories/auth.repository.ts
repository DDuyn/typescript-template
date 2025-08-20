import { db } from "@infra/db/drizzle";
import { profiles } from "@infra/db/schema/profile.schema";
import { supabaseService } from "@infra/db/supabase";
import { AuthTokenResponsePassword } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { SupabaseAuthService } from "../services/supabase.service";

export class AuthRepository {
  constructor(private supabaseAuth: SupabaseAuthService) {}

  async signInWithEmail(
    email: string,
    password: string
  ): Promise<AuthTokenResponsePassword> {
    return supabaseService.auth.signInWithPassword({ email, password });
  }

  async findIsAdmin(userId: string): Promise<boolean> {
    const [row] = await db
      .select({ isAdmin: profiles.isAdmin })
      .from(profiles)
      .where(eq(profiles.user_id, userId))
      .limit(1);

    if (!row) return false;
    return row.isAdmin;
  }

  async logout(accessToken: string): Promise<boolean> {
    return this.supabaseAuth.logout(accessToken);
  }
}
