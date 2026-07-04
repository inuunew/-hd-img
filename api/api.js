import axios from "axios";
import FormData from "form-data";

export async function enhanceHandler(req, res) {
  try {
    // Cek file
    if (!req.file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    // Buat FormData untuk dikirim ke API eksternal
    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Panggil API
    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/ai/wink",
      form,
      {
        params: { apikey: "jere_yy3jllbdh2f0" },
        headers: {
          ...form.getHeaders(),
          // Header ringan, tidak perlu meniru aplikasi mobile
          "User-Agent": "Mozilla/5.0 (compatible; WinkEnhancer/1.0)",
        },
        timeout: 15000,
        validateStatus: () => true, // tangkap semua status
      }
    );

    const data = apiResponse.data;
    console.log("API Response:", JSON.stringify(data));

    // Cek sukses (sesuai struktur respons API)
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
      // Ambil pesan error jika ada
      const errorMsg =
        data?.message || data?.error || "Respons API tidak valid";
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