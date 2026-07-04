// api/api.js
import axios from "axios";
import FormData from "form-data";

export async function enhanceHandler(req, res) {
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
      "https://api.jerexd.my.id/api/ai/wink",
      form,
      {
        params: { apikey: "jere_yy3jllbdh2f0" },
        headers: {
          ...form.getHeaders(),
          // Header tiruan dari aplikasi Wink (mobile)
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
          "Origin": "https://wink.ai",
          "Referer": "https://wink.ai/image-enhancer/upload",
          "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "\"Android\"",
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
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data));
    }
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message,
    });
  }
}