import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../config/superbase-config";
import type { ArticleLike } from "../models/article-like-mode.interface";

export interface LikeResult {
  success: boolean;
  message?: string;
  data?: ArticleLike;
  isLiked: boolean;
}

export class ArticleLikeRepository {
  private client: SupabaseClient = supabase;

  private async checkLike(articleId: number, ipHash: string): Promise<boolean> {
    const { data: existing } = await this.client
      .from("article_likes")
      .select("id")
      .eq("article_id", articleId)
      .eq("ip_hash", ipHash)
      .maybeSingle();

    return !!existing;
  }

  async toggleLike(articleId: number, ipHash: string): Promise<LikeResult> {
    try {
      const isAlreadyLiked = await this.checkLike(articleId, ipHash);

      if (isAlreadyLiked) {
        return {
          success: false,
          message: "Already hugged today ❤️",
          isLiked: true,
        };
      }

      const { data, error } = await this.client
        .from("article_likes")
        .insert({ article_id: articleId, ip_hash: ipHash })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add like: ${error.message}`);
      }

      return {
        success: true,
        data: data as ArticleLike,
        isLiked: true,
        message: "Hug received! ❤️",
      };
    } catch (error: any) {
      return {
        success: false,
        isLiked: false,
        message: error,
      };
    }
  }

  async getLikeStatus(
    articleId: number,
  ): Promise<{ isLiked: boolean; hugCount: number }> {
    const { data: article } = await this.client
      .from("article")
      .select("like_count")
      .eq("id", articleId)
      .single();

    let isLiked = false;
    const hugCount = article?.like_count;
    if (hugCount > 0) {
      isLiked = true;
    }

    return { isLiked, hugCount: article?.like_count ?? 0 };
  }
}
