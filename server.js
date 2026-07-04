import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Konfigurasi multer (simpan di memory)
const upload = multer({ storage: multer.memoryStorage() });

// Sajikan halaman utama (index.html di root)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint enhance
app.post("/enhance", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/ai/wink?apikey=jere_yy3jllbdh2f0",
      form,
      {
        headers: form.getHeaders(),
        timeout: 15000,
      }
    );

    const data = apiResponse.data;
    if (data.status && data.resultUrl) {
      res.json({
        success: true,
        resultUrl: data.resultUrl,
        creator: data.creator || "",
      });
    } else {
      throw new Error("Respons API tidak valid");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message,
    });
  }
});

export default app;