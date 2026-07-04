// api/api.js
import axios from "axios";
import FormData from "form-data";

export async function enhanceHandler(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, {   // <-- coba "file", bukan "image"
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
          // Tiruan header dari aplikasi Wink (mobile)
          "accept": "*/*",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
          "Origin": "https://wink.ai",
          "Referer": "https://wink.ai/image-enhancer/upload",
          "sec-ch-ua": "\"Google Chrome\";v=\"147\", \"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"147\"",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "\"Android\"",
          "ab_info": JSON.stringify({ ab_codes: [], version: "1.4.4" }),
          // Cookie tidak perlu, karena API key sebagai pengganti otentikasi
        },
        timeout: 15000,
        validateStatus: () => true, // Tangkap semua status, jangan throw error otomatis
      }
    );

    console.log("API Response Status:", apiResponse.status);
    console.log("API Response Data:", JSON.stringify(apiResponse.data));

    if (apiResponse.status === 200 && apiResponse.data?.status && apiResponse.data?.resultUrl) {
      res.json({
        success: true,
        resultUrl: apiResponse.data.resultUrl,
        creator: apiResponse.data.creator || "",
      });
    } else {
      // Ambil pesan error dari API jika ada
      const msg = apiResponse.data?.message || apiResponse.data?.error || "Respons API tidak valid";
      throw new Error(msg);
    }
  } catch (error) {
    console.error("=== PROXY ERROR ===");
    console.error("Message:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data));
    }
    console.error("====================");

    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.response?.data?.error || error.message,
    });
  }
}