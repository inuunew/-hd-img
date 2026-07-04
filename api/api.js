// api/api.js
import axios from "axios";
import FormData from "form-data";

export async function enhanceHandler(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    // Siapkan FormData untuk dikirim ke API eksternal
    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Panggil API eksternal (proxy)
    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/ai/wink",
      form,
      {
        params: { apikey: "jere_yy3jllbdh2f0" }, // API key via query param
        headers: {
          ...form.getHeaders(),
          // Jika perlu tambahkan Origin/Referer:
          // "Origin": "https://wink.ai",
          // "Referer": "https://wink.ai/",
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
    console.error("Proxy error:", error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message,
    });
  }
}