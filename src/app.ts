import express from "express";
import dotenv from "dotenv";
dotenv.config();

import articleRoutes from "./routes/article-routes";
import { supabase } from "./config/superbase-config";

import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler";
import rantRouter from "./routes/rant-doc-routes";
import { shareRouter } from "./controllers/article-share";
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
  // process.exit(1); // Temporarily commented out for debugging
}
const allowedOrigins = [
  process.env.CORS_ORIGIN1,
  process.env.CORS_ORIGIN2,
  process.env.CORS_ORIGIN3,
  process.env.CORS_ORIGIN4,
  process.env.CORS_ORIGIN5,
  process.env.CORS_ORIGIN6,
  process.env.CORS_ORIGIN7,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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

// Parse JSON bodies AFTER logger, but only for actual JSON/form requests.
app.use(express.json({ type: ["application/json", "application/*+json"] }));
app.use(
  express.urlencoded({
    extended: true,
    type: ["application/x-www-form-urlencoded"],
  }),
);

app.use("/api", articleRoutes, rantRouter, shareRouter);

app.post("/api/login", async (req, res) => {
  // Keep original request body parsing here for reference:
  const body = Buffer.isBuffer(req.body)
    ? JSON.parse(req.body.toString())
    : req.body;

  const { email, password } = body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
});

app.post("/api/login", (req, res) => {
  res.json({
    body: req.body,
    headers: req.headers,
  });
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
  // changes 1

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

// Global error handlers for unhandled errors
process.on("unhandledRejection", (reason: any) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error: any) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

export default app;
