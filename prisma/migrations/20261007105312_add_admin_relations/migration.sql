-- AlterTable
ALTER TABLE "Destinasi" ADD COLUMN     "adminId" INTEGER;

-- AlterTable
ALTER TABLE "Pesanan" ADD COLUMN     "adminId" INTEGER;

-- AddForeignKey
ALTER TABLE "Destinasi" ADD CONSTRAINT "Destinasi_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pesanan" ADD CONSTRAINT "Pesanan_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
