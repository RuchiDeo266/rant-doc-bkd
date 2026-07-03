import type { Request, Response } from "express";
import { Router } from "express";
import { supabase } from "../config/superbase-config";
import { SupabaseClient } from "@supabase/supabase-js";

export const shareRouter = Router();

const client: SupabaseClient = supabase;

export const postShareCount = async (req: Request, res: Response) => {
  try {
    const rantId = req.params.id;

    const { data, error } = await supabase.rpc("increment_share_count", {
      rant_id: rantId,
    });

    if (error) throw error;

    res.json({ success: true, shareCount: data.share_count });
  } catch (err) {
    console.error("Share increment failed:", err);
    res.status(500).json({ error: "Failed to record share" });
  }
};

export const getShareCount = async (req: Request, res: Response) => {
  const rantId = req.params.id;

  try {
    const { data } = await client
      .from("article")
      .select("share_count")
      .eq("id", rantId)
      .single();

    res.json({ shareCount: data?.share_count ?? 0 });
  } catch (error: any) {
    throw new Error("error in fetching data", error);
  }
};
