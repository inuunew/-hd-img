// api/api.js
import axios from "axios";
import FormData from "form-data";

export async function enhanceHandler(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    const form = new FormData();
    // Coba gunakan field "file" jika "image" tidak berhasil
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/ai/wink",
      form,
      {
        params: { apikey: "jere_yy3jllbdh2f0" },
        headers: {
          ...form.getHeaders(),
          // Biarkan header default, jangan meniru aplikasi lain dulu
          // "User-Agent": "Mozilla/5.0 (Linux; Android 10; K)...",
          // "Origin": "https://wink.ai",
          // "Referer": "https://wink.ai/image-enhancer/upload",
        },
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
    // Logging lengkap
    console.error("=== PROXY ERROR ===");
    console.error("Message:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Headers:", JSON.stringify(error.response.headers));
      console.error("Data:", JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error("No response received");
    }
    console.error("====================");

    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message,
    });
  }
}