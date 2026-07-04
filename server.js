import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { enhanceHandler } from "./api/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Terima file dari field apa pun
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Pakai upload.any() agar semua field file diterima
app.post("/api/enhance", upload.any(), enhanceHandler);

export default app;