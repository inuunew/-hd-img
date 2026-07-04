import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { enhanceImage } from "./wink.js";

const app = express();
const PORT = 3000;

// Folder untuk upload sementara
const uploadDir = "assets";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

app.use(express.static("public"));

// Endpoint untuk enhance
app.post("/enhance", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file yang diunggah" });
    }

    const imagePath = req.file.path;
    console.log("Processing:", imagePath);

    const resultUrl = await enhanceImage(imagePath);
    console.log("Result:", resultUrl);

    // Hapus file upload setelah diproses (opsional)
    fs.unlink(imagePath, () => {});

    res.json({ success: true, resultUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));