import type { Request, Response } from "express";
import { ArticleService } from "../services/article-service.ts";
import { ArticleRepository } from "../repo/articlerep.ts";
import { createSupabaseClient } from "../config/superbase-config.ts";
import { MediaService } from "../services/media-serivice.ts";

import { MulterError } from "multer";

const repo = new ArticleRepository();
const media = new MediaService();
const service = new ArticleService(repo, media);

export const getArticles = async (_: any, res: Response) => {
  try {
    const articles = await service.getArticles();
    res.json({ articles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getArticlesbyID = async (req: Request, res: Response) => {
  try {
    const articles = await service.getArticlebyID(Number(req.params.id));
    res.json({ articles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

let image_url: string, audio_url: string;

export const createArticle = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("No authorization token");

    const supa = createSupabaseClient(token);

    service.getArticlebyID;

    const { title, subtitle, body, video_url, tags: tagsRaw, like } = req.body;

    const existingArticle = await service.getArticleByTitle(title, supa);

    if (existingArticle.length >= 1) {
      return res.status(409).json({
        message:
          "Article with this title already exists – duplicates not allowed",
      });
    }

    // Parse tags safely (assuming client sends comma-separated or JSON array)
    let tags: string[] = [];
    if (tagsRaw) {
      tags = Array.isArray(tagsRaw)
        ? tagsRaw
        : tagsRaw.split(",").map((t: string) => t.trim());
    }

    const files = req.files as
      | { image?: Express.Multer.File[]; audio?: Express.Multer.File[] }
      | undefined;

    if (!files?.image?.[0]) {
      return res.status(400).json({ message: "Image file is required" });
    }
    if (!files?.audio?.[0]) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const imageFile = files.image[0];
    const audioFile = files.audio[0];

    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error("Image file too large (max 5MB)");
    }
    if (audioFile.size > 20 * 1024 * 1024) {
      throw new Error("Audio file too large (max 20MB)");
    }

    // Upload to Cloudflare R2
    image_url = await media.uploadImage(
      imageFile.buffer,
      imageFile.originalname,
      imageFile.mimetype,
    );

    audio_url = await media.uploadAudio(
      audioFile.buffer,
      audioFile.originalname,
      audioFile.mimetype,
    );

    if (!image_url) throw new Error("Failed to upload image");
    if (!audio_url) throw new Error("Failed to upload audio");

    const article = await service.addArticle(
      {
        title,
        subtitle,
        body,
        image: image_url,
        audio: audio_url,
        video_url: video_url || null,
        created_at: new Date(),
        tags,
      },
      supa,
    );

    return res.status(201).json(article);
  } catch (error: any) {
    console.error("Article creation failed:", error);

    const message =
      error instanceof MulterError
        ? `Upload error: ${error.code} - ${error.message}`
        : error.message || "Failed to create article";

    return res.status(400).json({ message });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const token = req.headers.authorization?.split(" ")[1];
    const supa = createSupabaseClient(token);
    const article = await service.updateArticle(req.body, id, supa);
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
