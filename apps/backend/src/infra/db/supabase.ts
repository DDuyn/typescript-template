import { createClient } from "@supabase/supabase-js";
import { env } from "../../core/env/env";

export const supabasePublic = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);
export const supabaseService = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);
