<p align="center">
  <img src="httpsT://res.cloudinary.com/NAMA_CLOUD_ANDA/image/upload/v12345/adcom-web/ID_LOGO_ANDA.png" alt="Logo ADCOM" width="150" />
</p>

<h1 align="center">
  Website Resmi ADCOM IKMI
</h1>

<p align="center">
  Portal komunitas *full-stack* modern untuk Android Developer Community (ADCOM) STMIK IKMI Cirebon.
  <br />
  Dibangun dengan desain <strong>Neumorphism</strong> yang bersih dan tumpukan teknologi modern (React, Node.js, MongoDB).
</p>

<p align="center">
  <a href="https://adcom-ikmi.fun">
    <img src="https://img.shields.io/badge/Website-adcom--ikmi.fun-blue?style=for-the-badge&logo=vercel" alt="Situs Live">
  </a>
  <a href="https://github.com/adcomikmi/adcom">
    <img src="https://img.shields.io/github/last-commit/adcomikmi/adcom?style=for-the-badge&logo=github" alt="Commit Terakhir">
  </a>
</p>

---

## 🚀 Fitur Utama

Website ini dibagi menjadi tiga tingkatan akses dengan fungsionalitas yang kaya untuk setiap peran.

### 👤 Pengunjung Umum (Publik)
* **Halaman Home Dinamis:** Menampilkan *carousel* banner (1-5 gambar) dan 3 kartu fitur yang kontennya dapat diubah oleh Admin.
* **Halaman Tentang Dinamis:** Menampilkan Visi, Misi (poin-poin), dan 3 pilar organisasi yang dapat dikelola oleh Admin.
* **Materi & Tugas:** Melihat daftar materi dan tugas dengan *pagination* (daftar halaman).
* **Download Publik:** Mengunduh file materi (via *proxy backend* dari Supabase).
* **Desain Neumorphism:** Tampilan *soft UI* yang konsisten dan responsif.

### 👨‍💻 Anggota (Setelah Login)
* **Otentikasi:** Login aman menggunakan NIM dan Password.
* **Ganti Password Pertama:** Pengguna baru (yang *password*-nya = NIM) dipaksa untuk membuat *password* baru.
* **Kirim Tugas:** Fitur untuk meng-*upload* jawaban tugas (mendukung *multiple files*).
* **Kirim Ulang Tugas:** Anggota dapat mengganti jawaban tugas mereka (file lama akan dihapus permanen dari *storage*).
* **Ruang Diskusi (Forum):**
    * Membuat *thread* baru, mengedit, dan menghapus *thread* sendiri.
    * Membalas *thread* dan memberi *like* (suka).
    * **Balasan Bersarang (Nested):** Membalas komentar orang lain (seperti Facebook/Reddit).
    * *Lazy Loading* balasan (Tombol "Lihat X balasan lagi").
* **Saran & Kritik:** Mengirim *feedback* ke admin, dengan opsi untuk mengirim sebagai **anonim**.

### 👑 Admin
* **Otentikasi Google:** Login aman khusus untuk Admin yang emailnya terdaftar di *database* (menggunakan Google OAuth 2.0).
* **Manajemen Konten (Materi):**
    * *Upload* materi/tugas baru (mendukung *multiple files*).
    * Melihat **Riwayat Konten** dengan *pagination*.
    * **Edit/Hapus** materi (file di Cloudinary/Supabase akan ikut terhapus).
* **Manajemen Data (Anggota):**
    * Melihat daftar semua anggota.
    * Menambah anggota satu per satu.
    * Menambah anggota secara massal via **upload file CSV**.
* **Manajemen Data (Feedback):**
    * Melihat *feed* "Saran & Kritik" dengan *pagination* dan fitur *accordion* "Lihat Detail".
    * Menghapus *feedback* secara permanen.
* **Manajemen Data (Jawaban Tugas):**
    * Melihat tabel "Informasi Jawaban".
    * Mengklik baris untuk membuka *modal* detail.
    * **Men-download file jawaban** anggota dengan aman (via *proxy backend*).
* **Generator Informasi:**
    * Membuat *template* pesan WA (CRUD - Create, Read, Update, Delete).
    * Sistem *parsing* cerdas untuk membuat *form* dinamis (mendukung `date`, `time`, `number`, `email`, `select`, dll).
    * Tombol "Salin" dan "Kirim ke WhatsApp".
* **CMS (Modif Website):**
    * Panel terpadu dengan *tab* untuk mengedit Halaman Home, Tentang, dan Admin Dashboard.
    * Mengganti logo, *upload* *carousel* (1-5 gambar), dan mengedit semua teks (Visi, Misi, Fitur, dll).

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

Arsitektur proyek ini menggunakan struktur *monorepo* yang disatukan untuk Vercel.

### Frontend (`/src`)
* **Framework:** React 19 (dijalankan oleh Vite)
* **Styling:** Tailwind CSS (Desain Neumorphism)
* **Routing:** React Router v7
* **UI/Animasi:** Headless UI (Modal) & Framer Motion
* **Lainnya:** Swiper.js (Carousel), React Icons, Axios, date-fns, Papaparse (CSV), React Markdown

### Backend (`/backend` & `/api`)
* **Runtime:** Node.js (Express)
* **Database:** MongoDB dengan Mongoose
* **Otentikasi:** JWT (Token) & Passport.js (Google OAuth 2.0)
* **Penyimpanan Gambar:** Cloudinary (CDN, Cache & Optimasi)
* **Penyimpanan File:** Supabase Storage (Untuk file tugas & jawaban)
* **Lainnya:** Multer (File Upload), bcryptjs (Password Hashing)

---

## 🚀 Menjalankan Secara Lokal (Development)

Proyek ini adalah *monorepo* yang disatukan. Anda perlu menjalankan dua terminal.

**Terminal 1: Menjalankan Backend (Server)**
1.  Buka terminal di *root* proyek (`adcom-unified/`).
2.  Buat file `.env` di *root* (ikuti contoh `.env.example`).
3.  Jalankan `npm install`.
4.  Jalankan server:
    ```bash
    npm run server 
    ```
    (Ini akan menjalankan `nodemon --env-file=.env api/index.js`)

**Terminal 2: Menjalankan Frontend (Client)**
1.  Buka terminal **kedua** di *root* proyek.
2.  Buat file `src/.env.local` (isi dengan `VITE_...` keys).
3.  Jalankan *development server* Vite:
    ```bash
    npm run dev
    ```
4.  Buka `http://localhost:5173` di *browser* Anda.

### Variabel Lingkungan (`.env`)
Anda perlu membuat file `.env` di *root* (`adcom-unified/`) dan mengisinya dengan 13 kunci *backend*:
```.env
# Wajib untuk Backend (server/src/index.js)
MONGO_URI=...
JWT_SECRET=...
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Supabase (File Tugas & Jawaban)
SUPABASE_PROJECT_ID=...
SUPABASE_SERVICE_KEY=...
SUPABASE_BUCKET_NAME=materi-adcom

# Cloudinary (Gambar Publik & Logo)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
