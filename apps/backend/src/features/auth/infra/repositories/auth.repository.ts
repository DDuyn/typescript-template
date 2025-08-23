import { db } from "@infra/db/drizzle";
import { profiles } from "@infra/db/schema/profile.schema";
import { supabaseService } from "@infra/db/supabase";
import { AuthError, AuthTokenResponsePassword } from "@supabase/supabase-js";
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
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!row) return false;
    return row.isAdmin;
  }

  async logout(accessToken: string): Promise<boolean> {
    return this.supabaseAuth.logout(accessToken);
  }

  async recoverPassword(email: string): Promise<
    | {
        data: {};
        error: null;
      }
    | { data: null; error: AuthError }
  > {
    return supabaseService.auth.resetPasswordForEmail(email);
  }

  async signUp(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabaseService.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) return false;

    try {
      await db.insert(profiles).values({
        userId: data.user.id,
        isAdmin: false,
      });
      return true;
    } catch (e) {
      console.error("Failed to insert profile:", e);
      return false;
    }
  }
}
