import { supabase } from "../config/superbase-config.ts";
import type { Article } from "../models/article-model-interface.ts";
import type { SupabaseClient } from "@supabase/supabase-js";

type NewArticle = Omit<Article, "id">;
type UpdateArticle = Partial<Omit<Article, "id">>;

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
  ): Promise<boolean> {
    const { error } = await client.from("article").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }
}
