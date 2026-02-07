import type { Request, Response } from "express";
import { ArticleService } from "../services/article-service.ts";
import { ArticleRepository } from "../repo/articlerep.ts";
const repo = new ArticleRepository();
const service = new ArticleService(repo);

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await service.getArticles();
    // res.json(articles);
    res.json({ articles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const article = await service.addArticle(req.body);
    res.status(201).json(article);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const article = await service.updateArticle(req.body, id);
    res.status(201).json(article);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const message = await service.deleteArticle(id);
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
