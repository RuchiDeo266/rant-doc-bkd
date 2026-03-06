import { Router } from "express";
import { getLike, postLike } from "../controllers/article-like.controller.ts";
import { getView, postView } from "../controllers/view-controller.ts";

const rantRouter = Router();

// app/api/rant-articles/like/[id]
rantRouter.get("/rant-articles/like/:id", getLike);
rantRouter.post("/rant-articles/like/:id", postLike);

// app/api/rant-articles/view/[id]
rantRouter.get("/rant-articles/view/:id", getView);
rantRouter.post("/rant-articles/view/:id", postView);

export default rantRouter;
