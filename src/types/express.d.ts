import { User } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      files?: {
        image?: Express.Multer.File[];
        audio?: Express.Multer.File[];
      };
    }
  }
}

export {};
