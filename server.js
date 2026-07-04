import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();

// Konfigurasi multer (simpan file di memory)
const upload = multer({ storage: multer.memoryStorage() });

// Sajikan file statis dari folder public
app.use(express.static("public"));

// Endpoint enhance
app.post("/enhance", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    // Siapkan FormData
    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Panggil API eksternal
    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/ai/wink?apikey=jere_yy3jllbdh2f0",
      form,
      {
        headers: form.getHeaders(),
        timeout: 15000, // 15 detik
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

// Export untuk Vercel (tidak pakai app.listen)
export default app;