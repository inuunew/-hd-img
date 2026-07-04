# HD Photo

Website upscaler foto menggunakan API `api.jerexd.my.id`, dengan API key
disimpan aman di server (Vercel Serverless Function) — tidak terekspos
di kode frontend.

## Struktur

```
.
├── index.html        # Frontend statis (di-serve langsung oleh Vercel)
├── api/
│   └── hd.js          # Serverless function: proxy ke api.jerexd.my.id
├── package.json
├── vercel.json
└── .env.example
```

Frontend memanggil `POST /api/hd` (endpoint milik sendiri) mengirim file +
skala. Function `api/hd.js` yang berjalan di server menambahkan API key
dari environment variable, lalu meneruskan permintaan ke
`https://api.jerexd.my.id/api/tools/hd2`.

## Cara deploy ke Vercel

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "init hd photo"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

2. **Import project di Vercel**
   - Buka https://vercel.com/new
   - Pilih repo GitHub ini
   - Framework preset: biarkan **Other** (tidak perlu build command,
     tidak perlu output directory)

3. **Set Environment Variable**
   Sebelum atau setelah deploy pertama, buka:
   `Project Settings → Environment Variables`, tambahkan:

   | Key              | Value                     |
   |------------------|---------------------------|
   | `JEREXD_API_KEY` | `jere_yy3jllbdh2f0`       |

   Terapkan untuk environment **Production**, **Preview**, dan
   **Development**, lalu **redeploy**.

4. Selesai. Buka domain yang diberikan Vercel, upload foto, pilih skala,
   klik "Proses Foto".

## Menjalankan lokal (opsional)

```bash
npm install -g vercel
npm install
vercel dev
```

`vercel dev` otomatis membaca `.env` (bikin file `.env` dari
`.env.example` lalu isi API key kamu) dan menjalankan `api/hd.js` sebagai
serverless function lokal di `http://localhost:3000`.

## Kenapa API key tidak ditaruh di index.html?

Kalau API key ditulis langsung di file HTML/JS, siapa pun yang membuka
"View Source" di browser bisa melihat dan memakai key tersebut. Dengan
menaruh logic panggilan API di `api/hd.js` (berjalan di server, bukan di
browser), API key hanya tersimpan sebagai environment variable di Vercel
dan tidak pernah dikirim ke browser pengguna.
