import axios from "axios";
import FormData from "form-data";
import busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Request harus multipart/form-data" });
    }

    const scale = req.query.scale || "4";
    if (!["2", "4"].includes(scale)) {
      return res.status(400).json({ error: "Scale hanya bisa 2 atau 4" });
    }

    // Parsing file dengan busboy
    const bb = busboy({ headers: req.headers });
    let fileBuffer = null;
    let fileName = "";
    let mimeType = "";

    bb.on("file", (fieldname, file, info) => {
      const chunks = [];
      file.on("data", (chunk) => chunks.push(chunk));
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
        fileName = info.filename;
        mimeType = info.mimeType;
      });
    });

    // Tunggu busboy selesai
    await new Promise((resolve, reject) => {
      bb.on("close", resolve);
      bb.on("error", reject);
      req.pipe(bb);
    });

    if (!fileBuffer) {
      return res.status(400).json({ error: "Tidak ada file gambar" });
    }

    // Kirim ke API eksternal
    const form = new FormData();
    form.append("image", fileBuffer, {
      filename: fileName,
      contentType: mimeType,
    });

    const apiResponse = await axios.post(
      "https://api.jerexd.my.id/api/tools/hd2",
      form,
      {
        params: { apikey: "jere_yy3jllbdh2f0", scale },
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

    if (
      data &&
      (data.status === true || data.statusCode === 200) &&
      data.result?.upscaled_url
    ) {
      return res.status(200).json({
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
    console.error("Handler error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}