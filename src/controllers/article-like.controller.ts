import type { Request, Response } from "express";
import { ArticleLikeRepository } from "../repo/article-like";
import { HashService } from "../services/hash.service";

const repo = new ArticleLikeRepository();
const hashService = new HashService("10");

export async function postLike(req: Request, res: Response) {
  const articleId = Number(req.params.id);

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress;
  if (!ip) {
    throw Error("Invalid value");
  }
  // Get your hash service
  const ipHash = hashService.hash(ip);

  try {
    const result = await repo.toggleLike(articleId, ipHash);

    return res.json(result);
  } catch (error: any) {
    throw new Error("Some thing went wrong", error);
  }
}

export async function getLike(req: Request, res: Response) {
  const articleId = Number(req.params.id);
  // const ip = (req.headers["cf-connecting-ip"] as string) || "unknown";
  // const ipHash = hashService.hash(ip);

  try {
    const status = await repo.getLikeStatus(articleId);

    return res.json(status);
  } catch (error: any) {
    throw new Error("Some thing went wrong", error);
  }
}
