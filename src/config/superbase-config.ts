import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

export const supabase = createClient(
  "https://ucywiqvarituxmclckvy.supabase.co",
  process.env.SUPABASE_ANON_KEY!,
);

export function createSupabaseClient(token?: string): SupabaseClient {
  if (token) {
    return createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      },
    );
  }
  return supabase;
}
