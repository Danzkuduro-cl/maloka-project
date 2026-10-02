import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DestinasiCard from '@/components/DestinasiCard'
import {
  Search,
  Compass,
  Sparkles,
  Ticket,
  Users,
  Home,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
} from 'lucide-react'

// Server Component: Langsung ambil data dari PostgreSQL
export default async function HomePage() {
  // Query kategori + jumlah destinasi
  const kategoriList = await prisma.kategori.findMany({
    include: {
      _count: { select: { destinasis: true } },
    },
    orderBy: { nama: 'asc' },
  })

  // Query destinasi populer
  const destinasiPopuler = await prisma.destinasi.findMany({
    where: { isPopuler: true },
    include: {
      kategori: { select: { id: true, nama: true, slug: true } },
    },
    take: 6,
    orderBy: { id: 'asc' },
  })

  // Query layanan unggulan
  const sampleLayanan = await prisma.layanan.findMany({
    take: 4,
    include: {
      destinasi: { select: { nama: true } },
    },
    orderBy: { harga: 'asc' },
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-900 text-white overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background decorative glowing circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-teal-300 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Portal Resmi Informasi & Pemesanan Wisata Magelang</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Eksplorasi Keajaiban <span className="text-emerald-400">Magelang</span> Lebih Mudah &
            Terencana
          </h1>

          <p className="mt-6 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Dari kemegahan Candi Borobudur hingga siluet sunrise Menoreh dan gardu pandang Merapi.
            Pesan tiket, pemandu profesional, hingga transportasi wisata dalam satu platform.
          </p>

          {/* Search Box Form */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form
              action="/wisata"
              method="GET"
              className="p-2 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-gray-800"
            >
              <div className="flex items-center gap-2 px-3 py-2 w-full sm:flex-1">
                <Search className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Cari wisata (misal: Borobudur, Ketep, Punthuk)..."
                  className="w-full text-sm font-medium bg-transparent focus:outline-hidden placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-700/30 transition-all hover:scale-[1.02]"
              >
                <span>Cari Wisata</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-emerald-800/60 text-xs sm:text-sm text-emerald-200">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tiket Resmi & Instan</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pemandu HPI Berlisensi</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Paket Rombongan & Solo</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rute Wisata Lengkap</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATEGORI WISATA SECTION */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Jelajahi Berdasarkan Minat
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Kategori Wisata Magelang
              </h2>
            </div>
            <Link
              href="/wisata"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group"
            >
              Lihat Semua Destinasi
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kategoriList.map((kat) => (
              <Link
                key={kat.id}
                href={`/wisata?kategori=${kat.slug}`}
                className="group p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 group-hover:border-emerald-300 flex items-center justify-center text-emerald-600 shadow-2xs group-hover:scale-110 transition-transform mb-4">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors text-base">
                    {kat.nama}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {kat.deskripsi}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                  <span>{kat._count.destinasis} Destinasi</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DESTINASI POPULER SECTION */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Rekomendasi Wisatawan
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Destinasi Paling Populer di Magelang
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Pilihan favorit pelancong domestik & mancanegara yang wajib masuk dalam rencana
              liburan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {destinasiPopuler.map((destinasi) => (
              <DestinasiCard key={destinasi.id} destinasi={destinasi} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/wisata"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-emerald-600 text-sm font-semibold shadow-xs hover:shadow-md transition-all"
            >
              <span>Jelajahi Lebih Banyak Tempat Wisata</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. LAYANAN TRAVEL AGENT SECTION */}
      <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Kemudahan Dalam Satu Pintu
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Layanan Lengkap Travel Agent Maloka
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Tak perlu pusing buka banyak aplikasi terpisah. Pesan semua kebutuhan liburan Magelang
              di sini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-300 transition-all hover:shadow-md flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Tiket Destinasi</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed flex-1">
                Pemesanan tiket masuk Candi Borobudur, sunrise Punthuk Setumbu, dan Ketep Pass tanpa
                perlu antre di loket.
              </p>
              <Link
                href="/pesan"
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Pesan Tiket <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-300 transition-all hover:shadow-md flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Tour Guide Berlisensi</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed flex-1">
                Pemandu wisata bersertifikasi HPI (Himpunan Pramuwisata Indonesia) untuk membedah
                sejarah dan relief candi.
              </p>
              <Link
                href="/pesan"
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Pesan Guide <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-300 transition-all hover:shadow-md flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Homestay Balkondes</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed flex-1">
                Rasakan pengalaman bermalam di rumah tradisional Joglo di desa wisata sekitar Candi
                Borobudur.
              </p>
              <Link
                href="/pesan"
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Pesan Kamar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-300 transition-all hover:shadow-md flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Jeep Sunrise & Shuttle</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed flex-1">
                Petualangan Jeep 4x4 berburu sunrise Menoreh dan shuttle mobil full day keliling
                semua spot Magelang.
              </p>
              <Link
                href="/pesan"
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                Sewa Jeep <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (CTA) */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sudah Siap Berlibur ke Magelang?
          </h2>
          <p className="mt-4 text-base text-emerald-100 max-w-2xl mx-auto">
            Rencanakan tanggal kunjungan Anda sekarang, dapatkan konfirmasi instan, dan nikmati
            perjalanan wisata yang tak terlupakan bersama Maloka.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pesan"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
            >
              Mulai Pemesanan Sekarang
            </Link>
            <Link
              href="/cek-pesanan"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-900/60 border border-emerald-600 text-white font-semibold text-sm hover:bg-emerald-900 transition-all"
            >
              Cek Status Pesanan
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
