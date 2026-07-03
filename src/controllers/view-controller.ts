import type { Request, Response } from "express";
import { ViewService } from "../repo/article-view-repo";
import { HashService } from "../services/hash.service";

const viewService = new ViewService();
const hashService = new HashService("10");

export const postView = async (req: Request, res: Response) => {
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress;
  if (!ip) {
    throw new Error("Invalid IP address");
  }
  const articleId = Number(req.params.id);

  const ipHash = hashService.hash(ip);
  try {
    const result = await viewService.incrementView(articleId, ipHash);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to increment view" });
  }
};

export const getView = async (req: Request, res: Response) => {
  try {
    const views = await viewService.getViews(Number(req.params.id));
    res.json({ views }); // TODO: frontend logic for more than thousand reperesent it with 1k
  } catch (err) {
    res.status(500).json({ error: "Failed to get views" });
  }
};
