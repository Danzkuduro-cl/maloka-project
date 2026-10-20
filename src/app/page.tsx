/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import TravelPattern from '@/components/TravelPattern'
import DestinasiShowcase from '@/components/DestinasiShowcase'
import {
  Search,
  ArrowRight,
  Ticket,
  Users,
  Home,
  Truck,
  Luggage,
  Mountain,
  Landmark,
  FerrisWheel,
  Utensils,
  MoonStar,
  Compass,
} from 'lucide-react'

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1600&q=80'

// Gaya tombol bersama (sama seperti tombol "Cari Wisata")
const BTN_BASE =
  'group/btn inline-flex items-center justify-center gap-1.5 font-semibold rounded-full shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 ring-tosca'
const BTN_MD = 'h-11 px-7 text-sm'
const BTN_ARROW =
  'h-4 w-0 -ml-1 opacity-0 group-hover/btn:w-4 group-hover/btn:ml-0 group-hover/btn:opacity-100 transition-all duration-300'

// Data kartu layanan
const LAYANAN_ITEMS = [
  {
    icon: Ticket,
    iconBg: 'bg-tosca',
    title: 'Tiket Destinasi',
    desc: 'Tiket Borobudur, Punthuk Setumbu & Ketep Pass tanpa antre.',
    cta: 'Pesan Tiket',
  },
  {
    icon: Users,
    iconBg: 'bg-biru-tua',
    title: 'Tour Guide Berlisensi',
    desc: 'Pemandu bersertifikasi HPI untuk membedah sejarah candi.',
    cta: 'Pesan Guide',
  },
  {
    icon: Home,
    iconBg: 'bg-tosca',
    title: 'Homestay Balkondes',
    desc: 'Menginap di rumah Joglo di desa wisata sekitar Borobudur.',
    cta: 'Pesan Kamar',
  },
  {
    icon: Truck,
    iconBg: 'bg-biru-tua',
    title: 'Jeep Sunrise & Shuttle',
    desc: 'Jeep 4x4 sunrise Menoreh & shuttle full day keliling Magelang.',
    cta: 'Sewa Jeep',
  },
]

function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'alam':
      return Mountain
    case 'budaya-sejarah':
    case 'budaya':
      return Landmark
    case 'edukasi-rekreasi':
    case 'rekreasi':
      return FerrisWheel
    case 'kuliner':
      return Utensils
    case 'religi':
      return MoonStar
    default:
      return Compass
  }
}

// Server Component: Mengambil data langsung dari PostgreSQL
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

  // Query layanan unggulan (dipertahankan)
  await prisma.layanan.findMany({
    take: 4,
    include: {
      destinasi: { select: { nama: true } },
    },
    orderBy: { harga: 'asc' },
  })

  const destinasiShowcaseItems = destinasiPopuler.map((d) => ({
    id: d.id,
    nama: d.nama,
    lokasi: d.lokasi,
    fotoUrl: d.fotoUrl,
    hargaTiket: Number(d.hargaTiket) || 0,
    kategoriNama: d.kategori?.nama,
    isPopuler: d.isPopuler,
  }))

  const heroImage = destinasiPopuler[0]?.fotoUrl || FALLBACK_HERO_IMAGE

  return (
    <div className="flex flex-col min-h-screen bg-white text-teks-isi overflow-x-hidden">
      {/* =========================================================================
          2. HERO SECTION + SEARCH BOX + KATEGORI (Digabung agar background menyatu)
      ========================================================================= */}
      <div className="relative bg-biru-muda">
        <section className="relative min-h-105 lg:min-h-125 flex items-center justify-start overflow-hidden pt-16 pb-20 lg:pb-24">
          {/* Background Full Width Photo */}
          <img
            src={heroImage}
            alt="Keindahan Magelang"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-biru-tua/90 via-biru-tua/65 to-biru-tua/20" />

          {/* Hero Content Container */}
          <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-left z-10">
            {/* Kontainer teks dengan jarak antar baris yang disesuaikan */}
            <div className="max-w-2xl mt-8 sm:mt-12 lg:mt-16">
              {/* Eyebrow Script (Diberi jarak bawah lebih lega ke judul utama) */}
              <span className="font-script text-white text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-5 block drop-shadow-xs">
                Portal Resmi Informasi & Pemesanan Wisata Magelang
              </span>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Eksplorasi Keajaiban{' '}
                <span className="text-[#9BE3F5]">Magelang</span> Lebih Mudah &amp; Terencana
              </h1>

              {/* Description (Diberi jarak atas lebih lega dari judul utama) */}
              <p className="mt-5 sm:mt-6 text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
                Dari kemegahan Candi Borobudur hingga siluet sunrise Menoreh dan gardu pandang Merapi.
                Pesan tiket, pemandu profesional, hingga transportasi wisata dalam satu platform.
              </p>

              {/* Action Buttons (Diberi jarak atas lebih lega dari deskripsi) */}
              <div className="mt-8 sm:mt-9 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/wisata"
                  className={`${BTN_BASE} ${BTN_MD} bg-tosca hover:bg-tosca-tua text-white shadow-md hover:shadow-lg hover:shadow-tosca/30`}
                >
                  <span>Jelajahi Destinasi</span>
                  <ArrowRight className={BTN_ARROW} />
                </Link>

                <Link
                  href="#layanan"
                  className={`${BTN_BASE} ${BTN_MD} border-2 border-white text-white hover:bg-white hover:text-biru-tua shadow-md hover:shadow-lg hover:shadow-white/20`}
                >
                  <span>Layanan Kami</span>
                  <ArrowRight className={BTN_ARROW} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Search Box (Menimpa batas bawah hero dan area biru muda) */}
        <div className="relative -mt-7 sm:-mt-8 z-20 max-w-4xl mx-auto px-4 sm:px-6 pb-12 lg:pb-16">
          <form
            action="/wisata"
            method="GET"
            className="group flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-tosca/70 shadow-xl shadow-biru-tua/10
              transition-all duration-300 focus-within:border-tosca focus-within:shadow-2xl focus-within:shadow-tosca/20 focus-within:ring-4 focus-within:ring-tosca/10"
          >
            {/* Input */}
            <label className="flex items-center gap-3 flex-1 min-w-0 h-11 pl-3.5 pr-2 cursor-text">
              <Search className="w-5 h-5 text-tosca shrink-0" />
              <input
                type="text"
                name="search"
                placeholder="Cari destinasi, penginapan, transportasi..."
                className="w-full h-full text-sm font-medium bg-transparent focus:outline-hidden placeholder:text-placeholder text-teks-isi truncate"
              />
            </label>

            {/* Tombol */}
            <button
              type="submit"
              className={`${BTN_BASE} h-11 px-5 sm:px-7 text-sm text-white bg-linear-to-r from-tosca to-biru-tua shadow-md hover:shadow-lg hover:shadow-tosca/30`}
            >
              <span className="hidden sm:inline">Cari Wisata</span>
              <span className="sm:hidden">Cari</span>
              <ArrowRight className={BTN_ARROW} />
            </button>
          </form>
        </div>
      </div>

      {/* =========================================================================
          3. KATEGORI WISATA SECTION (Ikon, Busur Melengkung Setengah Lingkaran ke Atas)
      ========================================================================= */}
      <section className="relative bg-biru-muda py-10 lg:py-14 overflow-hidden">
        <TravelPattern />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Eyebrow Script + Title */}
          <span className="font-script text-biru-tua text-2xl sm:text-3xl block mb-1">
            Jelajahi Berdasarkan Minat
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-biru-tua tracking-tight">
            Kategori Wisata Magelang
          </h2>

          {/* Cards Row Desktop & Tablet: Satu baris, melengkung setengah lingkaran ke atas (kubah/arch) */}
          <div
            className="hidden sm:flex items-start justify-center gap-3.5 lg:gap-4.5 mt-8 lg:mt-9"
            style={{ paddingTop: '28px', paddingBottom: '12px' }}
          >
            {kategoriList.map((kat, index) => {
              const n = kategoriList.length
              const mid = (n - 1) / 2
              const t = n > 1 ? (index - mid) / (mid || 1) : 0
              // Rumus setengah lingkaran ke atas: kartu tengah paling tinggi (translateY paling negatif/naik),
              // lalu menurun secara bertahap dan simetris ke kiri dan kanan.
              // t=0 (tengah) => ty = -D (paling naik/tinggi)
              // t=±1 (ujung) => ty = 0 (posisi dasar/turun)
              const D = 26 // kedalaman busur px
              const ty = Math.round(-(1 - t * t) * D)
              const IconComponent = getCategoryIcon(kat.slug)

              return (
                /* Wrapper luar untuk posisi busur */
                <div
                  key={kat.id}
                  className="flex-1 min-w-0 max-w-48.75"
                  style={{ transform: `translateY(${ty}px)` }}
                >
                  {/* Elemen dalam untuk hover animasi naik sedikit */}
                  <Link
                    href={`/wisata?kategori=${kat.slug}`}
                    className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                  >
                    {/* Visual Card: Gaya Ikon Maloka persis Kuliner/Religi */}
                    <div className="w-full aspect-4/3 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 relative bg-linear-to-tr from-biru-tua to-tosca flex flex-col items-center justify-center p-3 text-white">
                      <IconComponent className="w-10 h-10 text-white/95 mb-1 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-[11px] font-semibold text-white/80 tracking-wide">
                        Maloka
                      </span>
                    </div>

                    {/* Text Below Card */}
                    <div className="mt-2.5 px-1 w-full">
                      <h3 className="font-bold text-sm text-biru-tua group-hover:text-tosca transition-colors leading-snug truncate">
                        {kat.nama}
                      </h3>
                      <span className="text-xs font-semibold text-tosca block mt-0.5">
                        {kat._count.destinasis} Destinasi
                      </span>
                      {kat.deskripsi && (
                        <p className="text-[11px] text-teks-sekunder mt-0.5 line-clamp-2 leading-relaxed">
                          {kat.deskripsi}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Mobile Grid: 2 kolom sejajar, lengkungan dimatikan */}
          <div className="grid grid-cols-2 sm:hidden gap-3 mt-7 px-1">
            {kategoriList.map((kat, index) => {
              const IconComponent = getCategoryIcon(kat.slug)
              const isLastOdd = kategoriList.length % 2 !== 0 && index === kategoriList.length - 1

              return (
                <Link
                  key={kat.id}
                  href={`/wisata?kategori=${kat.slug}`}
                  className={`group flex flex-col items-center text-center p-2.5 rounded-2xl bg-white/60 shadow-xs hover:shadow-md transition-all active:scale-95 ${
                    isLastOdd ? 'col-span-2 max-w-50 mx-auto w-full' : ''
                  }`}
                >
                  <div className="w-full aspect-4/3 rounded-xl bg-linear-to-tr from-biru-tua to-tosca flex flex-col items-center justify-center p-2.5 text-white shadow-xs">
                    <IconComponent className="w-8 h-8 text-white/95 mb-0.5 stroke-[1.8]" />
                    <span className="text-[10px] font-semibold text-white/80">Maloka</span>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-bold text-xs text-biru-tua group-hover:text-tosca leading-tight">
                      {kat.nama}
                    </h3>
                    <span className="text-[11px] font-semibold text-tosca block mt-0.5">
                      {kat._count.destinasis} Destinasi
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Button: Lihat Semua Destinasi */}
          <div className="mt-6 sm:mt-8">
            <Link
              href="/wisata"
              className={`${BTN_BASE} ${BTN_MD} border border-tosca text-tosca hover:bg-tosca hover:text-white shadow-sm hover:shadow-lg hover:shadow-tosca/30`}
            >
              <span>Lihat Semua Destinasi</span>
              <ArrowRight className={BTN_ARROW} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. DESTINASI POPULER SECTION (Coverflow)
      ========================================================================= */}
      <section className="bg-white py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Script + Title */}
          <span className="font-script text-biru-tua text-2xl sm:text-3xl block mb-1">
            Rekomendasi Wisatawan
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-biru-tua tracking-tight">
            Destinasi Paling Populer di Magelang
          </h2>
          <p className="mt-3 text-sm sm:text-base text-teks-sekunder max-w-2xl mx-auto">
            Pilihan favorit pelancong domestik &amp; mancanegara yang wajib masuk dalam rencana liburan Anda.
          </p>
        </div>

        {/* Coverflow Component */}
        <div className="mt-8 sm:mt-5">
          <DestinasiShowcase items={destinasiShowcaseItems} />
        </div>

        {/* Bottom Button */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/wisata"
            className={`${BTN_BASE} ${BTN_MD} bg-biru-tua hover:bg-biru-sangat-tua text-white shadow-md hover:shadow-lg hover:shadow-biru-tua/30`}
          >
            <span>Jelajahi Lebih Banyak Tempat Wisata</span>
            <ArrowRight className={BTN_ARROW} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          5. LAYANAN TRAVEL AGENT SECTION (Full Biru, 4 Kartu Berjejer)
      ========================================================================= */}
      <section id="layanan" className="relative bg-biru-muda py-14 lg:py-16 overflow-hidden">
        <TravelPattern />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Heading */}
          <div className="text-center">
            <span className="font-script text-biru-tua text-xl sm:text-2xl block mb-0.5">
              Kemudahan Dalam Satu Pintu
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-biru-tua tracking-tight">
              Layanan Lengkap Travel Agent Maloka
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-teks-sekunder max-w-xl mx-auto">
              Tak perlu pusing buka banyak aplikasi terpisah. Pesan semua kebutuhan liburan Magelang di sini.
            </p>
          </div>

          {/* 4 Kartu Berjejer (proporsi 4:3 di desktop) */}
          <div className="mt-9 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {LAYANAN_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href="/pesan"
                  className="group bg-white rounded-3xl border border-border shadow-md hover:border-tosca hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-4 sm:p-5 min-h-47.5 lg:aspect-4/3"
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="mt-3 text-sm sm:text-base font-bold text-biru-tua leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-teks-sekunder mt-1 leading-snug line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-tosca group-hover:gap-1.5 transition-all">
                    {item.cta}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. PLAN YOUR TRIP SECTION (Kolase Foto + CTA)
      ========================================================================= */}
      <section className="bg-white py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Kolase Foto (Kiri, 5-6 kolom) */}
            <div className="lg:col-span-6 flex gap-4 items-center justify-center">
              {/* Foto Besar Tinggi Melengkung (Kiri) */}
              <div className="w-1/2 aspect-3/4 rounded-t-full rounded-b-3xl overflow-hidden shadow-xl">
                <img
                  src={destinasiPopuler[0]?.fotoUrl || FALLBACK_HERO_IMAGE}
                  alt="Destinasi Utama"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 2 Foto Bersusun (Kanan) */}
              <div className="w-1/2 flex flex-col gap-4">
                <div className="aspect-3/2 rounded-[1.3rem] overflow-hidden shadow-md">
                  <img
                    src={destinasiPopuler[1]?.fotoUrl || FALLBACK_HERO_IMAGE}
                    alt="Destinasi Kedua"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-3/2 rounded-[1.2rem] overflow-hidden shadow-md">
                  <img
                    src={destinasiPopuler[2]?.fotoUrl || FALLBACK_HERO_IMAGE}
                    alt="Destinasi Ketiga"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Konten Teks CTA (Kanan, 6-7 kolom) */}
            <div className="lg:col-span-6 relative text-left lg:pl-6">
              {/* Decorative Circle Background */}
              <div className="w-72 h-72 rounded-full bg-biru-muda/60 absolute -right-10 -bottom-10 pointer-events-none -z-10" />
              <Luggage className="w-12 h-12 text-tosca/15 absolute -top-8 right-6 pointer-events-none" />

              <span className="font-script text-tosca text-2xl sm:text-3xl block mb-2">
                Rencana Wisata
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-biru-tua tracking-tight leading-tight">
                Sudah Siap Berlibur ke Magelang?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-teks-sekunder leading-relaxed">
                Rencanakan tanggal kunjungan Anda sekarang, dapatkan konfirmasi instan, dan nikmati
                perjalanan wisata yang tak terlupakan bersama Maloka.
              </p>

              {/* Tombol Aksi */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/pesan"
                  className={`${BTN_BASE} ${BTN_MD} bg-biru-tua hover:bg-biru-sangat-tua text-white shadow-md hover:shadow-lg hover:shadow-biru-tua/30`}
                >
                  <span>Mulai Pemesanan Sekarang</span>
                  <ArrowRight className={BTN_ARROW} />
                </Link>
                <Link
                  href="/cek-pesanan"
                  className={`${BTN_BASE} ${BTN_MD} border-2 border-biru-tua text-biru-tua hover:bg-biru-muda shadow-sm hover:shadow-lg hover:shadow-biru-tua/20`}
                >
                  <span>Cek Status Pesanan</span>
                  <ArrowRight className={BTN_ARROW} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* =========================================================================
          7. GALERI DESTINASI (Mosaik 5 Kolom)
      ========================================================================= */}
      {destinasiPopuler.length >= 3 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-script text-biru-tua text-2xl sm:text-3xl block mb-1">
              Momen Perjalanan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-biru-tua tracking-tight mb-12 sm:mb-16">
              Galeri Destinasi
            </h2>
            {/* Desktop 5-Column Mosaic — Foto Tidak Ganda */}
            <div className="hidden lg:grid grid-cols-5 gap-4 items-center">
              {/* Kolom 1 */}
              <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-sm">
                <Link href={`/wisata/${destinasiPopuler[0].id}`} className="block w-full h-full group">
                  <img
                    src={destinasiPopuler[0].fotoUrl || FALLBACK_HERO_IMAGE}
                    alt={destinasiPopuler[0].nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              {/* Kolom 2 — Atas */}
              <div className="flex flex-col gap-4">
                <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
                  <Link href={`/wisata/${destinasiPopuler[1 % destinasiPopuler.length].id}`} className="block w-full h-full group">
                    <img
                      src="https://images.unsplash.com/photo-1530406574868-4b989cf06d8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                      alt={destinasiPopuler[1 % destinasiPopuler.length].nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
                <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
                  <Link href={`/wisata/${destinasiPopuler[2 % destinasiPopuler.length].id}`} className="block w-full h-full group">
                    <img
                      src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                      alt={destinasiPopuler[2 % destinasiPopuler.length].nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
              {/* Kolom 3 — Tengah Tinggi */}
              <div className="aspect-3/5 rounded-2xl overflow-hidden shadow-md ring-2 ring-tosca/30">
                <Link href={`/wisata/${destinasiPopuler[3 % destinasiPopuler.length].id}`} className="block w-full h-full group">
                  <img
                    src="https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D  "
                    alt="Pemandangan Magelang"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              {/* Kolom 4 — Bawah */}
              <div className="flex flex-col gap-4">
               {/* Kolom 4 — Atas */}
              <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
                <Link href={`/wisata/${destinasiPopuler[4 % destinasiPopuler.length].id}`} className="block w-full h-full group">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D "
                    alt="Pemandangan Magelang"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
                <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-sm">
                  <Link href={`/wisata/${destinasiPopuler[5 % destinasiPopuler.length].id}`} className="block w-full h-full group">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D "
                      alt={destinasiPopuler[5 % destinasiPopuler.length].nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
              {/* Kolom 5 — Berbeda dari kolom 1 */}
              <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-sm">
                <Link href={`/wisata/${destinasiPopuler[2 % destinasiPopuler.length].id}`} className="block w-full h-full group">
                  <img
                    src={destinasiPopuler[2 % destinasiPopuler.length].fotoUrl || FALLBACK_HERO_IMAGE}
                    alt={destinasiPopuler[2 % destinasiPopuler.length].nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>
            {/* Mobile / Tablet 2-Column Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-3 sm:gap-4">
              {destinasiPopuler.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/wisata/${dest.id}`}
                  className="aspect-4/3 rounded-2xl overflow-hidden shadow-xs group"
                >
                  <img
                    src={dest.fotoUrl || FALLBACK_HERO_IMAGE}
                    alt={dest.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}