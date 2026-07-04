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
          // Tidak perlu header tambahan yang rumit, cukup user-agent standar
          "User-Agent": "Mozilla/5.0 (compatible; WinkEnhancer/1.0)",
        },
        timeout: 15000,
        validateStatus: () => true, // tangkap semua status
      }
    );

    const data = apiResponse.data;
    console.log("API Response:", JSON.stringify(data));

    // Cek sukses berdasarkan status atau statusCode
    if (data && (data.status === true || data.statusCode === 200) && data.resultUrl) {
      res.json({
        success: true,
        resultUrl: data.resultUrl,
        creator: data.creator || "",
      });
    } else {
      // Jika API memberikan pesan error, teruskan
      const errorMsg = data?.message || data?.error || "Respons API tidak valid";
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}