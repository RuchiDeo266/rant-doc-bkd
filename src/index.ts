import express from "express";
import dotenv from "dotenv";
import articleRoutes from "./routes/article-routes.ts";
import { supabase } from "./config/superbase-config.ts";

import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";
// import path from "path";
import { errorHandler } from "./middleware/error-handler.ts";
import rantRouter from "./routes/rant-doc-routes.ts";
import { shareRouter } from "./controllers/article-share.ts";

dotenv.config();
// dotenv.config({ path: path.resolve(process.cwd(), '.production')
const app = express();

app.set("trust proxy", 1);
// Validate required environment variables at startup
const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "R2_ENDPOINT",
  "R2_USER_ACCESS_KEY_ID",
  "R2_USER_SECERT_KEY_ID",
  "R2_BUCKET",
  "R2_PUBLIC_DOMAIN",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error("Missing environment variables:", missingEnvVars);
  process.exit(1);
}
const allowedOrigins = [
  process.env.CORS_ORIGIN1,
  process.env.CORS_ORIGIN2,
  process.env.CORS_ORIGIN3,
  process.env.CORS_ORIGIN4,
  process.env.CORS_ORIGIN5,
  process.env.CORS_ORIGIN6,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error(`Not allowed by CORS → ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);

app.use(morgan("dev"));

app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: (req, _) => {
    const clientIp =
      (req.headers["cf-connecting-ip"] as string) || req.ip || "unknown";
    return ipKeyGenerator(clientIp);
  },
});

app.use(limiter);

// Parse JSON bodies AFTER logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", articleRoutes, rantRouter, shareRouter);

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
});

// This catches ALL errors from middleware (including multer)
app.use((err: any, req: any, res: any, next: any) => {
  console.error("=== GLOBAL ERROR HANDLER ===");
  console.error("Error message:", err.message);
  console.error("Stack:", err.stack);
  console.error("============================");

  // Check if it's a multer error
  if (err.name === "MulterError") {
    return res.status(400).json({
      error: "Upload error",
      message: err.message,
      code: err.code,
    });
  }

  // Your custom fileFilter errors
  if (
    err.message.includes("Invalid file format") ||
    err.message.includes("File type")
  ) {
    return res.status(400).json({
      error: "File validation failed",
      message: err.message,
    });
  }

  res.status(500).json({ error: "Internal server error" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ Server is running on port ${PORT}`);
});

// Global error handlers for unhandled errors
process.on("unhandledRejection", (reason: any) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error: any) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});
