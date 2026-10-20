import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import DestinasiCard from '@/components/DestinasiCard'
import {
  Search,
  Compass,
  Mountain,
  Landmark,
  Utensils,
  MoonStar,
  FerrisWheel,
  ArrowRight,
  Calendar,
  Users,
  Car,
} from 'lucide-react'

const BTN_BASE =
  'group/btn inline-flex items-center justify-center gap-2 font-semibold rounded-full shrink-0 cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 ring-tosca'
const BTN_MD = 'h-11 px-6 text-sm'
const BTN_LG = 'h-12 px-8 text-base'
const BTN_ARROW =
  'h-4 w-0 -ml-1 opacity-0 group-hover/btn:w-4 group-hover/btn:ml-0 group-hover/btn:opacity-100 transition-all duration-300'

function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'alam':
    case 'wisata-alam': return Mountain
    case 'budaya-sejarah':
    case 'wisata-budaya':
    case 'budaya': return Landmark
    case 'religi':
    case 'wisata-religi': return MoonStar
    case 'kuliner':
    case 'wisata-kuliner': return Utensils
    case 'edukasi-rekreasi':
    case 'wisata-edukasi':
    case 'rekreasi': return FerrisWheel
    default: return Compass
  }
}

export const dynamic = 'force-dynamic'

export default async function WisataPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; kategori?: string }>
}) {
  const { search, kategori } = await searchParams
  const categories = await prisma.kategori.findMany({ orderBy: { nama: 'asc' } })

  let kategoriFilterId: number | undefined
  let activeKategoriName = 'Semua Destinasi'
  if (kategori) {
    const selectedKat = categories.find((c) => c.slug === kategori)
    if (selectedKat) {
      kategoriFilterId = selectedKat.id
      activeKategoriName = selectedKat.nama
    }
  }

  const where = {
    ...(search ? {
      OR: [
        { nama: { contains: search, mode: 'insensitive' as const } },
        { lokasi: { contains: search, mode: 'insensitive' as const } },
        { deskripsi: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
    ...(kategoriFilterId ? { kategoriId: kategoriFilterId } : {}),
  }

  const destinasis = await prisma.destinasi.findMany({
    where,
    include: { kategori: { select: { id: true, nama: true, slug: true } } },
    orderBy: [{ isPopuler: 'desc' }, { nama: 'asc' }],
  })

  let popularDestinasis = destinasis.slice(0, 4)
  if (popularDestinasis.length === 0) {
    popularDestinasis = await prisma.destinasi.findMany({
      take: 4,
      orderBy: [{ isPopuler: 'desc' }, { id: 'asc' }],
      include: { kategori: { select: { id: true, nama: true, slug: true } } },
    })
  }

  const isFiltered = !!search || !!kategori
  const sectionTitle = isFiltered
    ? (kategori ? `${activeKategoriName} — Teratas` : 'Hasil Pencarian Teratas')
    : 'Destinasi Populer'

  const featuredDestinations = [
    { nama: 'Candi Borobudur', lokasi: 'Borobudur', fotoUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80' },
    { nama: 'Punthuk Setumbu', lokasi: 'Borobudur', fotoUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80' },
    { nama: 'Ketep Pass', lokasi: 'Sawangan', fotoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    { nama: 'Svargabumi Borobudur', lokasi: 'Borobudur', fotoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' },
  ]

  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-115 sm:min-h-125 flex items-center justify-center overflow-hidden pt-20 pb-10 text-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1600&q=80"
            alt="Keindahan Wisata Magelang"
            fill
            priority
            loading="eager"
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-biru-tua/75 via-biru-tua/60 to-biru-tua/80" />

        <div className="relative max-w-5xl w-full mx-auto px-4 sm:px-6 z-10 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Eksplorasi Destinasi{' '}
            <span className="text-[#9BE3F5]">Magelang</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl">
            Temukan tempat wisata terbaik di Magelang, mulai dari candi bersejarah, pegunungan, hingga kuliner khas.
          </p>

          {/* KATEGORI — Diperbaiki agar ikon tidak terpotong di HP */}
          <div className="mt-8 w-full overflow-x-auto pb-3">
            <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 flex-nowrap">
              <Link
                href={search ? `/wisata?search=${search}` : '/wisata'}
                className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-3 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  !kategori
                    ? 'bg-white/15 text-white font-semibold border border-white/25'
                    : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-xs mt-0.5">Semua</span>
              </Link>
              {categories.map((kat) => {
                const isActive = kategori === kat.slug
                const href = search
                  ? `/wisata?kategori=${kat.slug}&search=${search}`
                  : `/wisata?kategori=${kat.slug}`
                const IconComponent = getCategoryIcon(kat.slug)
                return (
                  <Link
                    key={kat.id}
                    href={href}
                    className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-3 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold border border-white/25'
                        : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs mt-0.5">{kat.nama}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-6 w-full max-w-3xl">
            <form
            action="/wisata"
            method="GET"
            className="group flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-tosca/70 shadow-xl shadow-biru-tua/10
              transition-all duration-300 focus-within:border-tosca focus-within:shadow-2xl focus-within:shadow-tosca/20 focus-within:ring-4 focus-within:ring-tosca/10"
          >
            <label className="flex items-center gap-3 flex-1 min-w-0 h-11 pl-3.5 pr-2 cursor-text">
              <Search className="w-5 h-5 text-tosca shrink-0" />
              <input
                type="text"
                name="search"
                defaultValue={search || ''}
                placeholder="Cari destinasi, lokasi, atraksi wisata..."
                className="w-full h-full text-sm font-medium bg-transparent focus:outline-hidden placeholder:text-gray-400 text-gray-800 truncate"
              />
              {kategori && <input type="hidden" name="kategori" value={kategori} />}
            </label>

            <button
              type="submit"
              className={`${BTN_BASE} ${BTN_MD} bg-linear-to-r from-tosca to-biru-tua text-white shadow-md hover:shadow-lg hover:shadow-tosca/30 hidden sm:flex`}
            >
              Cari Wisata
              <ArrowRight className={BTN_ARROW} />
            </button>
          </form>
          </div>
        </div>
      </section>

      {/* DESTINASI POPULER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">{sectionTitle}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {popularDestinasis.map((item) => (
            <Link
              key={item.id}
              href={`/wisata/${item.id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.fotoUrl || featuredDestinations[0].fotoUrl}
                  alt={item.nama}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 40px, 48px"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{item.nama}</h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {item.kategori?.nama || item.lokasi.split(',')[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DAFTAR DESTINASI */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase text-tosca">
              {kategori ? 'Kategori' : 'Wisata'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {kategori ? activeKategoriName : 'Jelajahi Magelang'}
            </h2>
          </div>
          <Link
            href="/wisata"
            className={`${BTN_BASE} h-9 px-5 text-xs text-tosca-tua border border-tosca/50 hover:bg-tosca hover:text-white shadow-2xs hover:shadow-sm`}
          >
            <span>{search || kategori ? 'Reset' : 'Lihat Semua'}</span>
            <ArrowRight className={BTN_ARROW} />
          </Link>
        </div>

        {destinasis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destinasis.map((d) => <DestinasiCard key={d.id} destinasi={d} />)}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-500">Tidak ada destinasi yang ditemukan.</p>
            <Link href="/wisata" className="mt-3 inline-block text-tosca hover:underline">
              Kembali ke Semua Destinasi
            </Link>
          </div>
        )}
      </main>

      {/* PENAWARAN KHUSUS — PAKET WISATA UNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 gap-3">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-tosca">Penawaran Khusus</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">Paket Wisata Unggulan</h2>
          </div>
          <Link
            href="/paket"
            className={`${BTN_BASE} ${BTN_MD} border border-tosca text-tosca hover:bg-tosca hover:text-white w-full sm:w-auto justify-center`}
          >
            Lihat Semua Paket
            <ArrowRight className={BTN_ARROW} />
          </Link>
        </div>

        <div className="rounded-3xl bg-linear-to-br from-tosca-tua via-[#0D728C] to-biru-tua p-5 sm:p-7 md:p-10 text-white overflow-hidden relative">
          {/* Badge Harga — tidak menabrak teks di HP */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/15 backdrop-blur-sm rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-right border border-white/15 z-20">
            <span className="text-xs font-medium text-white/70 block">Mulai Dari</span>
            <span className="text-xl sm:text-3xl font-bold text-[#9BE3F5]">Rp 50.000</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-14 sm:pt-16">
            <div className="max-w-md">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                Jelajahi Magelang Lebih Mudah
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white/80">
                Semua kebutuhan liburan dalam satu paket lengkap, siap menemani perjalananmu.
              </p>

              <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5 text-[#9BE3F5]" />
                  </div>
                  <span className="text-sm sm:text-base">Tiket masuk destinasi populer</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Users className="w-4.5 h-4.5 text-[#9BE3F5]" />
                  </div>
                  <span className="text-sm sm:text-base">Pemandu wisata berpengalaman</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Car className="w-4.5 h-4.5 text-[#9BE3F5]" />
                  </div>
                  <span className="text-sm sm:text-base">Tur jeep sunrise Borobudur</span>
                </div>
              </div>

              <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pesan"
                  className={`${BTN_BASE} ${BTN_LG} bg-white text-biru-tua hover:bg-white/95 shadow-lg w-full sm:w-auto`}
                >
                  Pesan Sekarang
                  <ArrowRight className={BTN_ARROW} />
                </Link>
                <Link
                  href="/pesan"
                  className={`${BTN_BASE} ${BTN_LG} bg-white/10 border border-white/20 text-white hover:bg-white/20 w-full sm:w-auto`}
                >
                  Lihat Detail
                  <ArrowRight className={BTN_ARROW} />
                </Link>
              </div>
            </div>

            {/* Gambar — di HP turun ke bawah, tidak tumpang tindih */}
            <div className="mt-6 lg:mt-16 grid grid-cols-2 gap-3 sm:gap-4">
              {featuredDestinations.map((item, i) => (
                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden group shadow-md">
                  <Image
                    src={item.fotoUrl}
                    alt={item.nama}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-sm font-bold text-white">{item.nama}</p>
                    <p className="text-xs text-white/75 mt-0.5">{item.lokasi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}