import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { enhanceHandler } from "./api/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Konfigurasi multer (simpan di memory, terima field "image")
const upload = multer({ storage: multer.memoryStorage() });

// Halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint enhance (proxy ke API eksternal)
app.post("/api/enhance", upload.single("image"), enhanceHandler);

// Export untuk Vercel
export default app;