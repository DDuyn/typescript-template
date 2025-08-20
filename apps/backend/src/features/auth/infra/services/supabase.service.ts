import { supabaseService } from "infra/db/supabase";

export class SupabaseAuthService {
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabaseService
      .from("profiles")
      .select("is_admin")
      .eq("user_id", userId)
      .single();

    if (error || !data) return false;
    return data.is_admin;
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
