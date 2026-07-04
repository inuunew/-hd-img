import axios from "axios";
import FormData from "form-data";

export async function enhanceHandler(req, res) {
  try {
    // Ambil file pertama dari req.files (karena pakai upload.any())
    const file = req.files?.[0];
    if (!file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    // Kirim ke API eksternal dengan field "image" (sesuai permintaan API)
    const form = new FormData();
    form.append("image", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/ai/wink",
      form,
      {
        params: { apikey: "jere_yy3jllbdh2f0" },
        headers: {
          ...form.getHeaders(),
          "User-Agent": "Mozilla/5.0 (compatible; WinkEnhancer/1.0)",
        },
        timeout: 15000,
        validateStatus: () => true,
      }
    );

    const data = apiResponse.data;
    console.log("API Response:", JSON.stringify(data));

    if (
      data &&
      (data.status === true || data.statusCode === 200) &&
      data.resultUrl
    ) {
      return res.json({
        success: true,
        resultUrl: data.resultUrl,
        creator: data.creator || "",
      });
    } else {
      const errorMsg = data?.message || data?.error || "Respons API tidak valid";
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error("Proxy error:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}