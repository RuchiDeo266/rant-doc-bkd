import type { Request, Response, NextFunction } from "express";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Generic to user side
  res.status(500).send({ error: "Something went wrong." });
};
