import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DestinasiCard from '@/components/DestinasiCard'
import {
  MapPin,
  Clock,
  Ticket,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Landmark,
} from 'lucide-react'

// Gaya tombol bersama landing page Maloka
const BTN_BASE =
  'group/btn inline-flex items-center justify-center gap-1.5 font-semibold rounded-full shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 ring-tosca'
const BTN_MD = 'h-11 px-7 text-sm'
const BTN_ARROW =
  'h-4 w-0 -ml-1 opacity-0 group-hover/btn:w-4 group-hover/btn:ml-0 group-hover/btn:opacity-100 transition-all duration-300'

// Pemetaan foto pendamping hero yang spesifik, akurat, dan relevan untuk setiap destinasi wisata Magelang
interface CompanionPhotoConfig {
  id?: number
  keywords: string[]
  companionUrl: string
}

const DESTINATION_COMPANION_PHOTOS: CompanionPhotoConfig[] = [
  {
    // Candi Borobudur (ID: 1)
    id: 1,
    keywords: ['borobudur', 'candi-borobudur'],
    companionUrl:
      'https://images.unsplash.com/photo-1566559532224-6d65e9fc0f37?auto=format&fit=crop&w=1200&q=80',
  },
  {
    // Ketep Pass (ID: 2)
    id: 2,
    keywords: ['ketep', 'ketep-pass', 'sawangan'],
    companionUrl:
      'https://images.unsplash.com/photo-1530406574868-4b989cf06d8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    // Punthuk Setumbu (ID: 9)
    id: 9,
    keywords: ['punthuk', 'setumbu', 'punthuk-setumbu'],
    companionUrl:
      'https://images.unsplash.com/photo-1762697743262-f8d48d35f4fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    // Candi Mendut & Vihara Mendut (ID: 4)
    id: 4,
    keywords: ['mendut', 'candi-mendut', 'vihara-mendut'],
    companionUrl:
      'https://images.unsplash.com/photo-1781002624717-b6a057de42c1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    // Svargabumi Borobudur (ID: 11)
    id: 11,
    keywords: ['svargabumi', 'svargabumi-borobudur'],
    companionUrl:
      'https://images.unsplash.com/photo-1608335715837-1994a535d5c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    // Sentra Kuliner Mangut Beong (ID: 12)
    id: 12,
    keywords: ['mangut', 'beong', 'mangut-beong', 'mangut-beong-sehati'],
    companionUrl:
      'https://images.unsplash.com/photo-1763994683476-5121580d9d48?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
  {
    // Nepal van Java (Dusun Butuh, Kaliangkrik)
    keywords: ['nepal', 'nepal-van-java', 'butuh', 'kaliangkrik'],
    companionUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    // Bukit Rhema / Gereja Ayam
    keywords: ['rhema', 'bukit-rhema', 'gereja-ayam', 'ayam'],
    companionUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  },
  {
    // Silancur Highland
    keywords: ['silancur', 'silancur-highland'],
    companionUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
]

// Fungsi resolver untuk menentukan foto pendamping yang 100% relevan dengan destinasi yang dibuka
function getCompanionImage(destinasi: {
  id?: number
  nama: string
  slug: string
  lokasi: string
  fotoUrl?: string | null
  kategori?: { slug: string; nama?: string } | null
}): string {
  // 1. Cek kecocokan langsung berdasarkan ID destinasi
  if (destinasi.id) {
    const byId = DESTINATION_COMPANION_PHOTOS.find((item) => item.id === destinasi.id)
    if (byId) {
      return byId.companionUrl
    }
  }

  const normalizedSlug = destinasi.slug.toLowerCase().trim()
  const normalizedNama = destinasi.nama.toLowerCase().trim()
  const normalizedLokasi = destinasi.lokasi.toLowerCase().trim()

  // 2. Cek kecocokan berdasarkan nama destinasi, slug, maupun wilayah lokasi
  for (const item of DESTINATION_COMPANION_PHOTOS) {
    if (
      item.keywords.some(
        (kw) =>
          normalizedSlug.includes(kw) ||
          normalizedNama.includes(kw) ||
          normalizedLokasi.includes(kw)
      )
    ) {
      return item.companionUrl
    }
  }

  // 3. Fallback jika ada destinasi kustom: gunakan foto alternatif yang sesuai dengan kategori destinasi
  const katSlug = destinasi.kategori?.slug?.toLowerCase() || ''
  if (katSlug.includes('alam')) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  }
  if (katSlug.includes('budaya') || katSlug.includes('sejarah')) {
    return 'https://images.unsplash.com/photo-1566559532224-6d65e9fc0f37?auto=format&fit=crop&w=1200&q=80'
  }
  if (katSlug.includes('kuliner')) {
    return 'https://images.unsplash.com/photo-1645696329525-8ec3bee460a9?auto=format&fit=crop&w=1200&q=80'
  }
  if (katSlug.includes('edukasi') || katSlug.includes('rekreasi')) {
    return 'https://images.unsplash.com/photo-1578754068182-91ea7ae12471?auto=format&fit=crop&w=1200&q=80'
  }
  if (katSlug.includes('religi')) {
    return 'https://images.unsplash.com/photo-1781002624717-b6a057de42c1?auto=format&fit=crop&w=1200&q=80'
  }

  return (
    destinasi.fotoUrl ||
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80'
  )
}

export const dynamic = 'force-dynamic'

export default async function DestinasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const destinasiId = parseInt(id)
  if (isNaN(destinasiId)) {
    notFound()
  }

  // Ambil detail destinasi utama
  const destinasi = await prisma.destinasi.findUnique({
    where: { id: destinasiId },
    include: {
      kategori: true,
      layanans: {
        orderBy: [{ tipe: 'asc' }, { harga: 'asc' }],
      },
    },
  })

  if (!destinasi) {
    notFound()
  }

  // Format harga tiket
  const hargaNumber = Number(destinasi.hargaTiket) || 0
  const formattedHarga =
    hargaNumber === 0 ? 'Gratis' : `Rp ${hargaNumber.toLocaleString('id-ID')}`

  const fotoUrl =
    destinasi.fotoUrl ||
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1600&q=80'

  // Gambar pendamping di bawah hero (disesuaikan dinamis & akurat dengan destinasi yang dibuka)
  const companionFotoUrl = getCompanionImage(destinasi)

  // Ambil destinasi terkait untuk rekomendasi
  let rekomendasiDestinasi = await prisma.destinasi.findMany({
    where: {
      kategoriId: destinasi.kategoriId,
      id: { not: destinasi.id },
    },
    take: 4,
    orderBy: [{ isPopuler: 'desc' }, { nama: 'asc' }],
    include: {
      kategori: { select: { id: true, nama: true, slug: true } },
    },
  })

  // Jika destinasi sekategori kurang dari 4, lengkapi dengan destinasi populer lainnya
  if (rekomendasiDestinasi.length < 4) {
    const excludeIds = [destinasi.id, ...rekomendasiDestinasi.map((d) => d.id)]
    const additional = await prisma.destinasi.findMany({
      where: {
        id: { notIn: excludeIds },
      },
      take: 4 - rekomendasiDestinasi.length,
      orderBy: [{ isPopuler: 'desc' }, { nama: 'asc' }],
      include: {
        kategori: { select: { id: true, nama: true, slug: true } },
      },
    })
    rekomendasiDestinasi = [...rekomendasiDestinasi, ...additional]
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      {/* =========================================================================
          1. HERO SECTION DIPERPANJANG DENGAN GRADIENT MASK (GAMBAR MELEBUR KE PUTIH)
      ========================================================================= */}
      <section className="relative w-full min-h-125 sm:min-h-140 lg:min-h-155 flex items-end overflow-hidden bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.1) 93%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.1) 93%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Image
            src={fotoUrl}
            alt={destinasi.nama}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            unoptimized
          />

          {/* Overlay Gelap Khas Maloka untuk Kontras Teks Judul (ikut memudar secara alami bersama gambar) */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 via-50% to-black/40" />
        </div>

        {/* Konten Hero: Judul, Badges & Metadata */}
        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 lg:pb-24 z-20">

          {/* Nama Destinasi Utama */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md max-w-4xl">
            {destinasi.nama}
          </h1>
        </div>
      </section>

      {/* =========================================================================
          2. INFORMASI UTAMA DUA KOLOM DENGAN GAMBAR PENDAMPING BERBEDA
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Kolom Kiri: Deskripsi Lengkap Destinasi */}
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-tosca block mb-1">
              DESKRIPSI DESTINASI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-5">
              Tentang {destinasi.nama}
            </h2>

            {/* Paragraf Deskripsi Asli */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {destinasi.deskripsi}
            </p>

            {/* Alamat Lengkap */}
            {destinasi.alamat && (
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-biru-muda/40 border border-tosca/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-tosca/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-tosca-tua" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-biru-tua mb-1">
                      Alamat Lengkap
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {destinasi.alamat}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Aksi - Menyesuaikan Gaya Tombol Landing Page Maloka */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {/* Tombol Utama: Pesan Tiket & Layanan */}
              <Link
                href="/pesan"
                className={`${BTN_BASE} ${BTN_MD} bg-linear-to-r from-tosca to-biru-tua hover:from-tosca-tua hover:to-biru-tua text-white shadow-md hover:shadow-lg hover:shadow-tosca/30`}
              >
                <span>Pesan Tiket & Layanan</span>
                <ArrowRight className={BTN_ARROW} />
              </Link>

              {/* Tombol Sekunder: Cek Status Pesanan */}
              <Link
                href="/cek-pesanan"
                className={`${BTN_BASE} ${BTN_MD} border-2 border-biru-tua text-biru-tua hover:bg-biru-muda shadow-xs hover:shadow-md hover:shadow-biru-tua/20`}
              >
                <CalendarCheck className="w-4 h-4 text-biru-tua" />
                <span>Cek Status Pesanan</span>
                <ArrowRight className={BTN_ARROW} />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Foto Pendamping yang Berbeda dari Hero, Relevan dengan Destinasi */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
              <Image
                src={companionFotoUrl}
                alt={`${destinasi.nama} - Foto Pendamping`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INFORMASI PENTING / FITUR KUNJUNGAN (WHY CHOOSE US)
      ========================================================================= */}
      <section className="bg-gray-50/70 border-y border-gray-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section Terpusat */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-tosca block mb-1">
              INFORMASI KUNJUNGAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Kenapa Memilih {destinasi.nama}?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Informasi esensial dan panduan kunjungan resmi untuk merencanakan liburan terbaik Anda.
            </p>
          </div>

          {/* 4 Kolom Fitur dengan Ikon Minimalis Bersejajar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fitur 1: Harga Tiket */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center flex flex-col items-center group hover:border-tosca/40 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-tosca/10 text-tosca-tua flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {formattedHarga}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Harga tiket resmi masuk kawasan wisata per orang.
              </p>
            </div>

            {/* Fitur 2: Jam Operasional */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center flex flex-col items-center group hover:border-tosca/40 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {destinasi.jamBuka} - {destinasi.jamTutup} WIB
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Jadwal operasional harian yang teratur untuk wisatawan.
              </p>
            </div>

            {/* Fitur 3: Kategori & Lokasi */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center flex flex-col items-center group hover:border-tosca/40 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1 truncate max-w-full">
                {destinasi.kategori.nama}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed truncate max-w-full">
                {destinasi.lokasi}
              </p>
            </div>

            {/* Fitur 4: Jaminan & Layanan Terpadu */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center flex flex-col items-center group hover:border-tosca/40 hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Layanan Terpadu Maloka
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Pemesanan tiket, tour guide, dan paket jeep resmi tanpa antre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PAKET & LAYANAN TERKAIT
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tosca block mb-1">
              PAKET & LAYANAN RESMI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Pilihan Layanan di {destinasi.nama}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Pesan tiket, pemandu wisata berlisensi HPI, atau transportasi langsung melalui Maloka.
            </p>
          </div>
          <Link
            href="/pesan"
            className={`${BTN_BASE} h-9 px-5 text-xs text-tosca-tua border border-tosca/50 hover:bg-tosca hover:text-white shadow-2xs hover:shadow-sm`}
          >
            <span>Lihat Semua Paket</span>
            <ArrowRight className={BTN_ARROW} />
          </Link>
        </div>

        {/* Grid Kartu Layanan */}
        {destinasi.layanans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destinasi.layanans.map((layanan) => {
              const price = Number(layanan.harga) || 0
              return (
                <div
                  key={layanan.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-lg hover:border-tosca/30 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>

                    {/* Judul & Deskripsi Layanan */}
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-tosca-tua transition-colors line-clamp-2 leading-snug">
                      {layanan.nama}
                    </h3>
                    {layanan.deskripsi && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                        {layanan.deskripsi}
                      </p>
                    )}
                  </div>

                  {/* Footer: Harga & Tombol Pesan - Konsisten Landing Page Pill Button */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Harga</span>
                      <span className="text-sm sm:text-base font-black text-gray-900">
                        Rp {price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Link
                      href={`/pesan?layananId=${layanan.id}`}
                      className={`${BTN_BASE} h-9 px-4 text-xs text-white bg-linear-to-r from-tosca to-biru-tua shadow-xs hover:shadow-md hover:shadow-tosca/25`}
                    >
                      <span>Pesan</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Fallback jika tidak ada layanan khusus */
          <div className="p-8 rounded-3xl bg-biru-muda/30 border border-tosca/20 text-center max-w-2xl mx-auto">
            <h3 className="text-base font-bold text-gray-900">
              Pemesanan Tiket & Paket Wisata
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Layanan khusus untuk {destinasi.nama} dapat dipesan melalui formulir reservasi resmi Maloka.
            </p>
            <div className="mt-5">
              <Link
                href="/pesan"
                className={`${BTN_BASE} ${BTN_MD} bg-linear-to-r from-tosca to-biru-tua text-white shadow-md hover:shadow-lg hover:shadow-tosca/30`}
              >
                <span>Buka Formulir Pemesanan</span>
                <ArrowRight className={BTN_ARROW} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          5. REKOMENDASI DESTINASI TERKAIT
      ========================================================================= */}
      {rekomendasiDestinasi.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 border-t border-gray-100">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tosca block mb-1">
                EKSPLORASI LEBIH JAUH
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Destinasi Terkait di Magelang
              </h2>
            </div>
            <Link
              href="/wisata"
              className={`${BTN_BASE} h-8 px-4 text-xs border border-tosca text-tosca hover:bg-tosca hover:text-white shadow-2xs hover:shadow-xs`}
            >
              <span>Lihat Semua</span>
              <ArrowRight className={BTN_ARROW} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rekomendasiDestinasi.map((item) => (
              <DestinasiCard key={item.id} destinasi={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}