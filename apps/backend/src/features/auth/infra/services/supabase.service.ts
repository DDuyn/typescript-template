import { db } from "@infra/db/drizzle";
import { profiles } from "@infra/db/schema/profile.schema";
import { supabaseService } from "@infra/db/supabase";
import { eq } from "drizzle-orm";

export class SupabaseAuthService {
  async isAdmin(userId: string): Promise<boolean> {
    const [row] = await db
      .select({ isAdmin: profiles.isAdmin })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!row) return false;
    return row.isAdmin;
  }

  async signOut(): Promise<boolean> {
    const { error } = await supabaseService.auth.signOut();

    if (error) {
      return false;
    }

    return true;
  }

  async logout(accessToken: string): Promise<boolean> {
    const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: process.env.SUPABASE_ANON_KEY!,
      },
    });

    if (!res.ok) {
      return false;
    }

    return true;
  }
}
