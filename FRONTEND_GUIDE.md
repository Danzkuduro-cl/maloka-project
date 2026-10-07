# 🎨 Panduan Frontend Developer — Maloka Project

Selamat datang di project **Maloka** (Website Informasi Wisata & Travel Agent Magelang)!  
Dokumen ini dibuat agar tim Frontend (**Maulida Hanifa Putri / UI Team**) bisa bekerja dengan nyaman, cepat, dan tanpa risiko kode bentrok (*merge conflict*) dengan tim Backend.

---

## 🚀 1. Persiapan Awal (Setup di Laptop)

1. **Clone repository (jika belum):**
   ```bash
   git clone https://github.com/Danzkuduro-cl/maloka-project.git
   cd maloka-project
   ```

2. **Install semua dependensi:**
   ```bash
   npm install
   ```

3. **Setup Environment (`.env`):**
   Pastikan ada file `.env` di root folder. Minta isi string database Supabase ke **Zidan (Backend)**:
   ```env
   DATABASE_URL="postgresql://postgres.ukntjxplcmvossyzppzs:supatest.com@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.ukntjxplcmvossyzppzs:supatest.com@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
   ```

4. **Jalankan local server:**
   ```bash
   npm run dev
   ```
   Buka di browser: 👉 `http://localhost:3000`

---

## 🚦 2. Pembagian Zona File (PENTING! Biar Gak Tabrakan)

Project ini menggunakan arsitektur **Next.js App Router (Fullstack)**. Agar pekerjaan Frontend dan Backend tidak saling tumpang tindih saat push ke GitHub, ikuti zona kerja berikut:

### 🟢 ZONA FRONTEND (Bebas Diubah / Dirombak oleh Tim FE)
| Folder / File | Penjelasan |
|---|---|
| `src/components/*` | Semua komponen UI (Navbar, Footer, Card, Modal, Form, dll) |
| `src/app/page.tsx` | Halaman utama (Landing Page) |
| `src/app/wisata/page.tsx` | Halaman katalog tempat wisata & filter |
| `src/app/wisata/[id]/page.tsx` | Halaman detail destinasi wisata |
| `src/app/pesan/page.tsx` | Halaman form booking layanan/paket wisata |
| `src/app/cek-pesanan/page.tsx` | Halaman tracking status tiket & invoice |
| `src/app/globals.css` | Styling CSS tambahan atau font global |

---

### 🔴 ZONA BACKEND (JANGAN DIUBAH TANPA KOORDINASI)
| Folder / File | Alasan |
|---|---|
| `src/app/api/**` | Endpoint API REST & controller backend |
| `src/lib/**` | Koneksi database Prisma & autentikasi session |
| `prisma/**` | Skema database, seeder data, dan file migrasi |
| `prisma7.config.ts` | Konfigurasi database Prisma ORM |

---

### 🟣 ZONA SHARED (Referensi Tipe Data)
- **`src/types/index.ts`**  
  File ini berisi interface TypeScript (`Destinasi`, `Kategori`, `Layanan`, `Pesanan`). Frontend disarankan memakai tipe dari file ini agar struktur data selalu seragam.

---

## 🎨 3. Design System & Styling (Tailwind CSS)

Project ini menggunakan **Tailwind CSS v4**. Tidak perlu membuat file CSS manual baru, gunakan class Tailwind langsung pada elemen JSX.

### 🌈 Palet Warna Standar Maloka:
- **Primary / Brand:** Nuansa Hijau Alam & Candi (`emerald-600`, `emerald-700`, `teal-600`)
- **Accent / Favorit:** Kuning Keemasan (`amber-400`, `amber-500`)
- **Background:** Putih Bersih & Abu-abu Lembut (`bg-white`, `bg-gray-50`)
- **Teks:** Kontras Tinggi (`text-gray-900`, `text-gray-600`, `text-gray-400`)

### 🔣 Icon Pack (`lucide-react`):
Icon sudah terpasang. Cukup import icon yang dibutuhkan dari `lucide-react`:
```tsx
import { MapPin, Clock, Search, Ticket, ArrowRight, Compass } from 'lucide-react'

// Contoh penggunaan:
<MapPin className="w-4 h-4 text-emerald-600" />
```

---

## 🔌 4. Cheatsheet API (Data yang Sudah Disediakan Backend)

Frontend tidak perlu bingung membuat dummy data. Backend sudah menyediakan endpoint API aktif yang langsung terhubung ke database cloud Supabase:

### 1. Ambil Semua Kategori
- **Method:** `GET`
- **URL:** `/api/kategori`
- **Output:** Array kategori beserta jumlah destinasi (`_count.destinasis`).

### 2. Ambil Destinasi Wisata (Support Search & Filter)
- **Method:** `GET`
- **URL:** `/api/destinasi`
- **Query Params Opsional:**
  - `?search=borobudur` (pencarian nama/lokasi)
  - `?kategori=1` (filter ID kategori)
  - `?populer=true` (hanya destinasi rekomendasi/favorit)
  - `?page=1&limit=12` (paginasi)

### 3. Ambil Detail 1 Destinasi
- **Method:** `GET`
- **URL:** `/api/destinasi/[id]` (contoh: `/api/destinasi/1`)
- **Output:** Detail destinasi lengkap beserta daftar `layanans` (tiket, guide, jeep) yang tersedia di tempat tersebut.

### 4. Ambil Layanan / Paket Travel Agent
- **Method:** `GET`
- **URL:** `/api/layanan`
- **Query Params Opsional:**
  - `?tipe=TIKET` (`TIKET` / `TOUR_GUIDE` / `PENGINAPAN` / `TRANSPORTASI`)
  - `?destinasi=1`

### 5. Kirim Form Pemesanan (Checkout Booking)
- **Method:** `POST`
- **URL:** `/api/pesanan`
- **Body JSON:**
  ```json
  {
    "namaPemesan": "Budi Santoso",
    "email": "budi@gmail.com",
    "telepon": "081234567890",
    "tanggalKunjungan": "2026-10-15",
    "jumlahOrang": 2,
    "catatan": "Butuh jemput di Stasiun Tugu",
    "layananIds": [
      { "layananId": 1, "jumlah": 2 },
      { "layananId": 3, "jumlah": 1 }
    ]
  }
  ```
- **Output:** Menghasilkan kode unik pesanan (misal: `MLK-20261007-001`).

### 6. Cek Status Invoice Pesanan
- **Method:** `GET`
- **URL:** `/api/pesanan/[kodePesanan]` (contoh: `/api/pesanan/MLK-20261002-001`)

---

## 🐙 5. Aturan Git Workflow (Anti Merge Conflict)

Agar tidak terjadi tabrakan kode di GitHub:

1. **Selalu update branch lokal sebelum mulai kerja:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Buat branch baru untuk setiap fitur/halaman yang dikerjakan:**
   ```bash
   # Format: feat/nama-fitur
   git checkout -b feat/tampilan-katalog
   ```

3. **Commit dengan pesan yang jelas:**
   ```bash
   git add .
   git commit -m "feat(ui): perbaiki desain kartu destinasi dan filter kategori"
   ```

4. **Push ke branch sendiri di GitHub:**
   ```bash
   git push origin feat/tampilan-katalog
   ```

5. **Buat Pull Request (PR) di GitHub** ke branch `main` dan diskusikan dengan tim/Backend sebelum di-merge.

---

## ❓ Butuh Bantuan?
- Jika butuh endpoint API baru atau ada data database yang kurang sesuai: **Hubungi Zidan (Backend)**.
- Jika butuh referensi flow dan wireframe: **Cek dokumen Figma / Hubungi Kayana (UI/UX)**.
- Selamat berkarya dan selamat mendesain tampilan Maloka yang ciamik! 🚀
