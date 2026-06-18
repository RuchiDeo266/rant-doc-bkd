import { Router } from "express";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesbyID,
} from "../controllers/article-controller.ts";
import { authMiddleware } from "../middleware/auth-handler.ts";
import { uploadArticleMedia } from "../middleware/multer-handler.ts";
import { getLike } from "../controllers/article-like.controller.ts";
const router = Router();

// CRUD operations for articles : ADMIN / OWNER

router.post("/articles", authMiddleware, uploadArticleMedia, createArticle);
router.get("/articles", getArticles);
router.get("/articles/:id", getArticlesbyID);
router.post("/articles-insert", authMiddleware, createArticle);
router.put("/articles-update/:id", authMiddleware, updateArticle);
router.delete("/articles-delete/:id", authMiddleware, deleteArticle);

router.get("/articles/like/:id", getLike);

export default router;
