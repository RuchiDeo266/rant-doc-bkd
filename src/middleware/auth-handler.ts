import type { Request, Response, NextFunction } from "express";
import { supabase } from "../config/superbase-config";
import type { User } from "@supabase/supabase-js";

interface UserRequest extends Request {
  user?: User;
}
export const authMiddleware = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ message: "Invalid token" });
  req.user = user;
  next();
};
