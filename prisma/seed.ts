import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seeding for Maloka...')

  // 1. Reset existing data in reverse order of foreign keys
  await prisma.detailPesanan.deleteMany()
  await prisma.pesanan.deleteMany()
  await prisma.layanan.deleteMany()
  await prisma.destinasi.deleteMany()
  await prisma.kategori.deleteMany()
  await prisma.admin.deleteMany()

  console.log('🧹 Cleaned up old data.')

  // 2. Seed Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: {
      nama: 'Administrator Maloka',
      email: 'admin@maloka.id',
      password: hashedPassword,
    },
  })
  console.log(`👤 Admin created: ${admin.email}`)

  // 3. Seed Kategori Wisata
  const kategoriData = [
    {
      nama: 'Wisata Budaya & Sejarah',
      slug: 'budaya-sejarah',
      deskripsi: 'Jelajahi peninggalan megah warisan dunia, candi bersejarah, dan kearifan lokal Magelang.',
    },
    {
      nama: 'Wisata Alam',
      slug: 'alam',
      deskripsi: 'Nikmati panorama perbukitan, lereng gunung Merapi-Merbabu, dan pesona sunrise Magelang.',
    },
    {
      nama: 'Wisata Religi',
      slug: 'religi',
      deskripsi: 'Destinasi spiritual dan ketenangan batin dengan nilai toleransi serta sejarah yang luhur.',
    },
    {
      nama: 'Wisata Kuliner',
      slug: 'kuliner',
      deskripsi: 'Cicipi kelezatan cita rasa khas Magelang, seperti Mangut Beong, Kupat Tahu, dan Wedang Kacang.',
    },
    {
      nama: 'Wisata Edukasi & Rekreasi',
      slug: 'edukasi-rekreasi',
      deskripsi: 'Aktivitas seru untuk keluarga dan teman, spot foto estetik di tengah sawah dan alam terbuka.',
    },
  ]

  const categories = await Promise.all(
    kategoriData.map((k) =>
      prisma.kategori.create({
        data: k,
      })
    )
  )
  console.log(`🏷️ ${categories.length} categories created.`)

  const [katBudaya, katAlam, katReligi, katKuliner, katEdukasi] = categories

  // 4. Seed Destinasi Wisata
  const borobudur = await prisma.destinasi.create({
    data: {
      nama: 'Candi Borobudur',
      slug: 'candi-borobudur',
      deskripsi:
        'Candi Buddha terbesar di dunia yang merupakan mahakarya arsitektur abad ke-8 dan Situs Warisan Dunia UNESCO. Dikelilingi panorama perbukitan Menoreh yang memukau.',
      hargaTiket: 50000,
      jamBuka: '06:30',
      jamTutup: '17:00',
      lokasi: 'Borobudur, Magelang',
      alamat: 'Jl. Badrawati, Kawasan Candi Borobudur, Kec. Borobudur, Kabupaten Magelang, Jawa Tengah 56553',
      fotoUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
      isPopuler: true,
      kategoriId: katBudaya.id,
    },
  })

  const ketep = await prisma.destinasi.create({
    data: {
      nama: 'Ketep Pass',
      slug: 'ketep-pass',
      deskripsi:
        'Pusat pengamatan dan gardu pandang terpopuler di antara Gunung Merapi dan Merbabu dengan ketinggian 1.200 mdpl. Dilengkapi bioskop mini vulkanologi dan teropong.',
      hargaTiket: 15000,
      jamBuka: '08:00',
      jamTutup: '17:00',
      lokasi: 'Sawangan, Magelang',
      alamat: 'Jl. Blabak - Boyolali Km 16, Ketep, Kec. Sawangan, Kabupaten Magelang, Jawa Tengah 56481',
      fotoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      isPopuler: true,
      kategoriId: katAlam.id,
    },
  })

  const punthuk = await prisma.destinasi.create({
    data: {
      nama: 'Punthuk Setumbu',
      slug: 'punthuk-setumbu',
      deskripsi:
        'Bukit setinggi 400 mdpl yang menjadi spot terbaik menyaksikan sunrise eksotis dengan siluet Candi Borobudur yang terbalut kabut pagi khas Magelang.',
      hargaTiket: 20000,
      jamBuka: '04:00',
      jamTutup: '17:30',
      lokasi: 'Borobudur, Magelang',
      alamat: 'Kurahan, Karangrejo, Kec. Borobudur, Kabupaten Magelang, Jawa Tengah 56553',
      fotoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      isPopuler: true,
      kategoriId: katAlam.id,
    },
  })

  const mendut = await prisma.destinasi.create({
    data: {
      nama: 'Candi Mendut & Vihara Mendut',
      slug: 'candi-mendut',
      deskripsi:
        'Candi bercorak Buddha yang berusia lebih tua dari Borobudur, memiliki arca Buddha Gautama setinggi 3 meter. Di dekatnya terdapat Vihara Mendut yang asri dan damai.',
      hargaTiket: 10000,
      jamBuka: '07:00',
      jamTutup: '19:00',
      lokasi: 'Mungkid, Magelang',
      alamat: 'Jl. Mayor Kusen, Mendut, Kec. Mungkid, Kabupaten Magelang, Jawa Tengah 56501',
      fotoUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      isPopuler: false,
      kategoriId: katReligi.id,
    },
  })

  const svargabumi = await prisma.destinasi.create({
    data: {
      nama: 'Svargabumi Borobudur',
      slug: 'svargabumi-borobudur',
      deskripsi:
        'Wisata edukasi dan rekreasi selfie di hamparan sawah hijau seluas 3 hektar dengan 22+ spot foto instagramable bernuansa alam pedesaan Jawa.',
      hargaTiket: 30000,
      jamBuka: '08:00',
      jamTutup: '17:30',
      lokasi: 'Borobudur, Magelang',
      alamat: 'Jl. Borobudur - Ngadiharjo, Ngaran Lor, Kec. Borobudur, Kabupaten Magelang, Jawa Tengah 56553',
      fotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      isPopuler: true,
      kategoriId: katEdukasi.id,
    },
  })

  const kulinerBeong = await prisma.destinasi.create({
    data: {
      nama: 'Sentra Kuliner Mangut Beong Sehati',
      slug: 'mangut-beong-sehati',
      deskripsi:
        'Kuliner legendaris ikan Beong khas Sungai Progo yang dimasak dengan kuah santan pedas gurih kaya rempah nusantara. Sensasi kuliner wajib saat berkunjung ke Borobudur.',
      hargaTiket: 0,
      jamBuka: '08:00',
      jamTutup: '20:00',
      lokasi: 'Borobudur, Magelang',
      alamat: 'Kembanglimus, Kec. Borobudur, Kabupaten Magelang, Jawa Tengah 56553',
      fotoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      isPopuler: false,
      kategoriId: katKuliner.id,
    },
  })

  console.log('🏛️ Destinations created.')

  // 5. Seed Layanan Wisata & Travel Agent
  const layananData = [
    // Tiket
    {
      nama: 'Tiket Masuk Pelataran Candi Borobudur',
      tipe: 'TIKET' as const,
      harga: 50000,
      deskripsi: 'Akses masuk kawasan taman dan pelataran Candi Borobudur untuk wisatawan domestik.',
      destinasiId: borobudur.id,
    },
    {
      nama: 'Tiket Naik Struktur Candi Borobudur (Substupa)',
      tipe: 'TIKET' as const,
      harga: 120000,
      deskripsi: 'Akses menaiki relief dan stupa utama Candi Borobudur didampingi pemandu dan upanat (sandal khusus).',
      destinasiId: borobudur.id,
    },
    {
      nama: 'Tiket Terusan Ketep Pass + Bioskop Vulkanologi',
      tipe: 'TIKET' as const,
      harga: 25000,
      deskripsi: 'Tiket masuk area gardu pandang Ketep Pass plus pemutaran film edukasi letusan Gunung Merapi.',
      destinasiId: ketep.id,
    },
    {
      nama: 'Tiket Sunrise Punthuk Setumbu',
      tipe: 'TIKET' as const,
      harga: 20000,
      deskripsi: 'Tiket masuk dini hari (mulai pukul 04:30) untuk menikmati momen sunrise siluet Borobudur.',
      destinasiId: punthuk.id,
    },
    // Tour Guide
    {
      nama: 'Private Tour Guide Borobudur Berlisensi HPI',
      tipe: 'TOUR_GUIDE' as const,
      harga: 150000,
      deskripsi: 'Pemandu wisata profesional bersertifikat HPI untuk membedah sejarah dan relief Candi Borobudur (durasi 2 jam).',
      destinasiId: borobudur.id,
    },
    {
      nama: 'Pemandu Trekking & Wisata Alam Ketep Pass',
      tipe: 'TOUR_GUIDE' as const,
      harga: 100000,
      deskripsi: 'Pemandu lokal untuk trekking santai desa wisata sekitar lereng Gunung Merapi dan kebun stroberi.',
      destinasiId: ketep.id,
    },
    // Penginapan
    {
      nama: 'Homestay Balkondes Karangrejo (Tradisional Joglo)',
      tipe: 'PENGINAPAN' as const,
      harga: 350000,
      deskripsi: 'Penginapan estetik bernuansa rumah tradisional Jawa di kawasan Balai Ekonomi Desa Karangrejo, termasuk sarapan.',
      destinasiId: borobudur.id,
    },
    {
      nama: 'Villa Merapi View Ketep (1 Kamar)',
      tipe: 'PENGINAPAN' as const,
      harga: 450000,
      deskripsi: 'Kamar nyaman berhawa sejuk dengan balkon langsung menghadap panorama megah Gunung Merapi.',
      destinasiId: ketep.id,
    },
    // Transportasi
    {
      nama: 'Sunrise Jeep Tour Punthuk Setumbu - Gereja Ayam',
      tipe: 'TRANSPORTASI' as const,
      harga: 450000,
      deskripsi: 'Sewa Jeep 4x4 kapasitas 4 orang untuk keliling sunrise Punthuk Setumbu, Gereja Ayam Bukit Rhema, dan pedesaan.',
      destinasiId: punthuk.id,
    },
    {
      nama: 'Shuttle Wisata Magelang City Tour (Mobil Full Day)',
      tipe: 'TRANSPORTASI' as const,
      harga: 550000,
      deskripsi: 'Mobil Avanza/Xenia + Driver + BBM keliling destinasi wisata Magelang selama 10 jam (maks 6 penumpang).',
      destinasiId: null, // Layanan standalone
    },
  ]

  for (const l of layananData) {
    await prisma.layanan.create({ data: l })
  }
  console.log(`🎫 ${layananData.length} services (layanan) created.`)

  // 6. Seed Pesanan Sample
  const sampleLayanan = await prisma.layanan.findFirst({
    where: { nama: { contains: 'Sunrise Jeep' } },
  })

  if (sampleLayanan) {
    const pesanan = await prisma.pesanan.create({
      data: {
        kodePesanan: 'MLK-20261002-001',
        namaPemesan: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        telepon: '081234567890',
        tanggalKunjungan: new Date('2026-10-15T04:30:00Z'),
        jumlahOrang: 4,
        totalHarga: sampleLayanan.harga,
        status: 'CONFIRMED',
        catatan: 'Tolong siapkan supir yang ramah dan siap jam 04.15 di lobby hotel.',
        detailPesanans: {
          create: [
            {
              layananId: sampleLayanan.id,
              jumlah: 1,
              subtotal: sampleLayanan.harga,
            },
          ],
        },
      },
    })
    console.log(`📋 Sample pesanan created with code: ${pesanan.kodePesanan}`)
  }

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
