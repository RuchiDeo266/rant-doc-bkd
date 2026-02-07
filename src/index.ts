import express from "express";
import dotenv from "dotenv";
import articleRoutes from "./routes/article-routes.ts";
import { supabase } from "./config/superbase-config.ts";
dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", articleRoutes);
app.get("/api", (req, res) => {
  res.send(`<p> hello </p>`);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
});

app.listen(process.env.PORT, () => {
  console.log("server is up running");
});
