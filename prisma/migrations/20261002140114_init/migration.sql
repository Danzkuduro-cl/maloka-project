-- CreateEnum
CREATE TYPE "TipeLayanan" AS ENUM ('TIKET', 'TOUR_GUIDE', 'PENGINAPAN', 'TRANSPORTASI');

-- CreateEnum
CREATE TYPE "StatusPesanan" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Kategori" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destinasi" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "hargaTiket" DECIMAL(10,2) NOT NULL,
    "jamBuka" TEXT NOT NULL,
    "jamTutup" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "alamat" TEXT,
    "fotoUrl" TEXT,
    "isPopuler" BOOLEAN NOT NULL DEFAULT false,
    "kategoriId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destinasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Layanan" (
    "id" SERIAL NOT NULL,
    "tipe" "TipeLayanan" NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,
    "deskripsi" TEXT,
    "destinasiId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Layanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pesanan" (
    "id" SERIAL NOT NULL,
    "kodePesanan" TEXT NOT NULL,
    "namaPemesan" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "tanggalKunjungan" TIMESTAMP(3) NOT NULL,
    "jumlahOrang" INTEGER NOT NULL DEFAULT 1,
    "totalHarga" DECIMAL(12,2) NOT NULL,
    "status" "StatusPesanan" NOT NULL DEFAULT 'PENDING',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPesanan" (
    "id" SERIAL NOT NULL,
    "pesananId" INTEGER NOT NULL,
    "layananId" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "DetailPesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_nama_key" ON "Kategori"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_slug_key" ON "Kategori"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destinasi_slug_key" ON "Destinasi"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pesanan_kodePesanan_key" ON "Pesanan"("kodePesanan");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Destinasi" ADD CONSTRAINT "Destinasi_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Layanan" ADD CONSTRAINT "Layanan_destinasiId_fkey" FOREIGN KEY ("destinasiId") REFERENCES "Destinasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPesanan" ADD CONSTRAINT "DetailPesanan_pesananId_fkey" FOREIGN KEY ("pesananId") REFERENCES "Pesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPesanan" ADD CONSTRAINT "DetailPesanan_layananId_fkey" FOREIGN KEY ("layananId") REFERENCES "Layanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
