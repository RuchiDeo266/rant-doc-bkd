import { Router } from "express";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/article-controller.ts";
import { authMiddleware } from "../middleware/auth-handler.ts";
const router = Router();

router.get("/articles", authMiddleware, getArticles);
router.post("/articles-insert", authMiddleware, createArticle);
router.put("/articles-update/:id", authMiddleware, updateArticle);
router.delete("/articles-delete/:id", authMiddleware, deleteArticle);

export default router;
