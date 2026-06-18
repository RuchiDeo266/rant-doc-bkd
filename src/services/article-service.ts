import { ArticleRepository } from "../repo/articlerep.ts";
import type { Article } from "../models/article-model-interface.ts";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MediaService } from "./media-serivice.ts";
import { supabase } from "../config/superbase-config.ts";

export class ArticleService {
  private repo: ArticleRepository;
  private media: MediaService;
  private client: SupabaseClient = supabase;

  constructor(repo: ArticleRepository, media: MediaService) {
    this.repo = repo; // Dependency injection for testability
    this.media = media;
  }

  async getArticlebyID(id: number, client?: SupabaseClient) {
    return this.repo.getById(id, client);
  }

  async getArticles(client?: SupabaseClient): Promise<Article[]> {
    return this.repo.getAll(client); // Add validation/logic if needed
  }

  async getArticleByTitle(
    title: string,
    client?: SupabaseClient,
  ): Promise<Article[]> {
    return this.repo.getByTitle(title, client);
  }

  async addArticle(
    article: Omit<Article, "id">,
    client?: SupabaseClient,
  ): Promise<Article> {
    if (
      !article.title ||
      !article.body ||
      !article.image ||
      !article.subtitle ||
      !article.audio ||
      !article.tags
    )
      throw new Error("Missing required fields");
    return this.repo.create(article, client);
  }

  async updateArticle(
    article: Omit<Article, "id">,
    id: number,
    client?: SupabaseClient,
  ): Promise<Article> {
    if (!article.title || !article.body || !article.subtitle || !article.tags)
      throw new Error("Missing required fields");
    return this.repo.update(article, id, client);
  }

  async deleteArticle(
    id: number,
  ): Promise<{ status: boolean; message: string }> {
    const result = await this.repo.getById(id);

    if (!result) {
      throw new Error("Failed to get data");
    }

    await this.media.deleteFromR2([result[0]?.image, result[0]?.audio]);
    await this.repo.deleteArticle(id);

    return { status: true, message: "Article Successfully Deleted" };
  }
}
