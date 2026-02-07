import { ArticleRepository } from "../repo/articlerep.ts";
import type { Article } from "../models/article-model-interface.ts";

export class ArticleService {
  private repo: ArticleRepository;

  constructor(repo: ArticleRepository) {
    this.repo = repo; // Dependency injection for testability
  }

  async getArticles(): Promise<Article[]> {
    return this.repo.getAll(); // Add validation/logic if needed
  }

  async addArticle(article: Omit<Article, "id">): Promise<Article> {
    // Business logic: e.g., validate title length
    if (
      !article.title ||
      !article.body ||
      !article.image_url ||
      !article.subtitle ||
      !article.video_url
    )
      throw new Error("Missing required fields");
    return this.repo.create(article);
  }

  async updateArticle(
    article: Omit<Article, "id">,
    id: number,
  ): Promise<Article> {
    if (
      !article.title ||
      !article.body ||
      !article.image_url ||
      !article.subtitle ||
      !article.video_url
    )
      throw new Error("Missing required fields");
    return this.repo.update(article, id);
  }

  async deleteArticle(
    id: number,
  ): Promise<{ status: boolean; message: string }> {
    const result = await this.repo.deleteArticle(id);
    if (!result) throw new Error("Deleting failed");
    return { status: result, message: "Article Successfully Deleted" };
  }
}
