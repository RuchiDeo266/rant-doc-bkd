import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
if (!process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.LAMBDA_TASK_ROOT) {
  dotenv.config();
}

export const supabase = createClient(
  process.env.SUPABASE_URL!,
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
