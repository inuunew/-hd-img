// Vercel Serverless Function
// Endpoint: POST /api/hd
// Menerima file gambar dari frontend, lalu meneruskannya ke API jerexd
// dengan API key yang disimpan aman di server (bukan terekspos di browser).

const { formidable } = require("formidable");
const fs = require("fs");

const JEREXD_ENDPOINT = "https://api.jerexd.my.id/api/tools/hd2";
const JEREXD_API_KEY = "jere_yy3jllbdh2f0";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ status: false, message: "Method not allowed" });
    return;
  }

  try {
    const form = formidable({ multiples: false, maxFileSize: 15 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);

    const scaleRaw = Array.isArray(fields.scale) ? fields.scale[0] : fields.scale;
    const scale = scaleRaw === "4" ? "4" : "2";

    const uploaded = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploaded) {
      res.status(400).json({ status: false, message: "Tidak ada file gambar yang diunggah." });
      return;
    }

    const buffer = fs.readFileSync(uploaded.filepath);
    const blob = new Blob([buffer], { type: uploaded.mimetype || "image/jpeg" });

const upstreamForm = new FormData();
upstreamForm.append("scale", scale);
upstreamForm.append("file", blob, uploaded.originalFilename || "photo.jpg");

    const upstreamRes = await fetch(
  `${JEREXD_ENDPOINT}?apikey=${encodeURIComponent(JEREXD_API_KEY)}`,
  {
    method: "POST",
    headers: {
      "User-Agent": "curl/8.7.1",
      "Accept": "application/json",
      "Accept-Encoding": "identity"
    },
    body: upstreamForm
  }
);

    const text = await upstreamRes.text();

console.log("STATUS:", upstreamRes.status);
console.log("BODY:", text);

let data;
try {
  data = JSON.parse(text);
} catch {
  return res.status(500).json({
    status: false,
    upstream_status: upstreamRes.status,
    upstream_body: text
  });
}

res.status(upstreamRes.status).json(data);
    
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err && err.message ? err.message : "Terjadi kesalahan pada server."
    });
  }
};
