import { supabase } from "../config/superbase-config.ts";
import type { Article } from "../models/article-model-interface.ts";

type NewArticle = Omit<Article, "id">;
type UpdateArticle = Partial<Omit<Article, "id">>;

export class ArticleRepository {
  async getAll(): Promise<Article[]> {
    const { data, error } = await supabase.from("article").select("*");
    if (error) throw new Error(error.message);
    return data as Article[];
  }

  async create(article: NewArticle): Promise<Article> {
    const { data, error } = await supabase
      .from("article")
      .insert(article)
      .select();
    if (error) throw new Error(error.message);
    return data[0] as Article;
  }

  async update(
    updateArticle: UpdateArticle,
    id: string | number,
  ): Promise<Article> {
    const { data, error } = await supabase
      .from("article")
      .update(updateArticle)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);
    return data[0] as Article;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const { error } = await supabase.from("article").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }
}
