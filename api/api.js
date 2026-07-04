import axios from "axios";
import FormData from "form-data";

export async function enhanceHandler(req, res) {
  try {
    const file = req.files?.[0];
    if (!file) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    // Ambil scale dari query string, default 4
    const scale = req.query.scale || "4";
    if (!["2", "4"].includes(scale)) {
      return res.status(400).json({ error: "Scale hanya bisa 2 atau 4" });
    }

    const form = new FormData();
    form.append("image", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/tools/hd2",
      form,
      {
        params: {
          apikey: "jere_yy3jllbdh2f0",
          scale: scale,
        },
        headers: {
          ...form.getHeaders(),
          "User-Agent": "Mozilla/5.0 (compatible; WinkEnhancer/1.0)",
        },
        timeout: 20000,
        validateStatus: () => true,
      }
    );

    const data = apiResponse.data;
    console.log("API Response:", JSON.stringify(data));

    // Struktur respons baru: data.result.upscaled_url
    if (
      data &&
      (data.status === true || data.statusCode === 200) &&
      data.result?.upscaled_url
    ) {
      return res.json({
        success: true,
        resultUrl: data.result.upscaled_url,
        scale_applied: data.result.scale_applied,
        engine: data.result.engine,
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