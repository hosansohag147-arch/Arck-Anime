import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic API Health Check
  app.get("/api/health", (req, res) => {
     res.json({ status: "ok", message: "Server is running smoothly without proxy limits!" });
  });

  // Future API routes for local player/data can go here
  app.get("/api/anime/data", (req, res) => {
    res.json({ success: true, message: "Anime data endpoint ready." });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  // server.ts এর এই অংশটুকু পরিবর্তন করুন
  } else {
    // __dirname এর পরিবর্তে process.cwd() ব্যবহার করা হচ্ছে যা রেন্ডারের জন্য নিরাপদ
    const distPath = path.resolve(process.cwd(), "dist"); 
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
