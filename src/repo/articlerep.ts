import { supabase } from "../config/superbase-config.ts";
import type { Article } from "../models/article-model-interface.ts";
import type { SupabaseClient } from "@supabase/supabase-js";

type NewArticle = Omit<Article, "id">;
type UpdateArticle = Partial<Omit<Article, "id">>;
type DeleteArticleResult = {
  success: boolean;
  articleDeleted: boolean;
  deleted: {
    view_logs: number;
    article_likes: number;
    rant_views: number;
    article: number;
  };
  errors?: string[];
};

export class ArticleRepository {
  async getById(id: number, client: SupabaseClient = supabase) {
    const { data, error } = await client
      .from("article")
      .select("*")
      .eq("id", id);
    if (error) throw new Error(error.message);
    if (!data) {
      throw new Error("FAILED : data not found");
    }
    return data as Article[];
  }

  async getAll(client: SupabaseClient = supabase): Promise<Article[]> {
    const { data, error } = await client.from("article").select("*");
    if (error) throw new Error(error.message);
    if (!data) {
      throw new Error("FAILED : data not found");
    }
    return data as Article[];
  }

  async getByTitle(
    title: string,
    client: SupabaseClient = supabase,
  ): Promise<Article[]> {
    const { data: article, error: dbErr } = await client
      .from("article")
      .select("*")
      .eq("title", title);

    if (dbErr) {
      throw new Error("Duplicate");
    }

    return article as Article[];
  }

  async create(
    article: NewArticle,
    client: SupabaseClient = supabase,
  ): Promise<Article> {
    const { data, error } = await client
      .from("article")
      .insert(article)
      .select();
    if (error) throw new Error(error.message);
    return data[0] as Article;
  }

  async update(
    updateArticle: UpdateArticle,
    id: string | number,
    client: SupabaseClient = supabase,
  ): Promise<Article> {
    const { data, error } = await client
      .from("article")
      .update(updateArticle)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);
    return data[0] as Article;
  }

  async deleteArticle(
    id: number,
    client: SupabaseClient = supabase,
  ): Promise<DeleteArticleResult> {
    const errors: string[] = [];
    const deleted = {
      view_logs: 0,
      article_likes: 0,
      rant_views: 0,
      article: 0,
    };

    try {
      // delete view_logs
      const { data: viewLogs, error: viewLogError } = await client
        .from("view_logs")
        .delete()
        .eq("rant_id", id)
        .select();

      // if (viewLogError) {
      //   errors.push(`view_logs: ${viewLogError.message}`);
      // } else {
      //   deleted.view_logs = viewLogs?.length || 0;
      // }

      // delete article_likes
      const { data: likes, error: likeError } = await client
        .from("article_likes")
        .delete()
        .eq("article_id", id)
        .select();

      // if (likeError) {
      //   errors.push(`article_likes: ${likeError.message}`);
      // } else {
      //   deleted.article_likes = likes?.length || 0;
      // }

      // delete rant_views
      const { data: views, error: viewsError } = await client
        .from("rant_views")
        .delete()
        .eq("id", id)
        .select();

      // if (viewsError) {
      //   errors.push(`rant_views: ${viewsError.message}`);
      // } else {
      //   deleted.rant_views = views?.length || 0;
      // }

      // delete article (main table)
      const { data: article, error: articleError } = await client
        .from("article")
        .delete()
        .eq("id", id)
        .select();

      if (articleError) {
        errors.push(`article: ${articleError.message}`);
      } else {
        deleted.article = article?.length || 0;
      }

      return {
        success: errors.length === 0 && deleted.article > 0,
        articleDeleted: deleted.article > 0,
        deleted,
        errors: errors.length ? errors : undefined,
      };
    } catch (err: any) {
      throw new Error(errors.toString());
    }
  }
}
