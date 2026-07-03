// backend/services/viewService.js
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../config/superbase-config";
import { randomUUID } from "crypto";

export class ViewService {
  private client: SupabaseClient = supabase;
  async incrementView(rantId: number, ipAddress: string) {
    // Check if already viewed by this IP (basic dedupe)
    try {
      const { data: existing } = await this.client
        .from("view_logs")
        .select("id")
        .eq("rant_id", rantId)
        .eq("ip_address", ipAddress)
        .maybeSingle();

      if (existing) {
        return { success: false, message: "Already viewed" };
      }

      // const { data, error } = await this.client.rpc("increment", {
      //   table_name: "rant_views",
      //   column_name: "views",
      //   row_id: rantId,
      //   id_column: "rant_id",
      // });

      const { data, error } = await supabase.rpc("increment_rant_views", {
        rant: rantId,
      });

      if (error) throw error;

      await this.client.from("view_logs").insert({
        rant_id: rantId,
        ip_address: ipAddress,
      });

      return { success: true };
    } catch (error) {
      console.error("Error incrementing view:", error);
      return { success: false, message: "Failed to increment view" };
    }
  }

  async getViews(rantId: number) {
    const { data } = await this.client
      .from("rant_views")
      .select("views")
      .eq("rant_id", rantId)
      .single();

    return data?.views ?? 0;
  }
}
