import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DestinasiCard from '@/components/DestinasiCard'
import { Search, Compass, SlidersHorizontal, MapPin } from 'lucide-react'

export default async function WisataPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; kategori?: string }>
}) {
  const { search, kategori } = await searchParams

  // Query semua kategori untuk filter pills
  const categories = await prisma.kategori.findMany({
    orderBy: { nama: 'asc' },
  })

  // Cari kategori ID jika slug diberikan
  let kategoriFilterId: number | undefined
  let activeKategoriName = 'Semua Kategori'
  if (kategori) {
    const selectedKat = categories.find((c) => c.slug === kategori)
    if (selectedKat) {
      kategoriFilterId = selectedKat.id
      activeKategoriName = selectedKat.nama
    }
  }

  // Where query untuk Prisma
  const where = {
    ...(search
      ? {
          OR: [
            { nama: { contains: search, mode: 'insensitive' as const } },
            { lokasi: { contains: search, mode: 'insensitive' as const } },
            { deskripsi: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(kategoriFilterId ? { kategoriId: kategoriFilterId } : {}),
  }

  // Ambil data destinasi
  const destinasis = await prisma.destinasi.findMany({
    where,
    include: {
      kategori: { select: { id: true, nama: true, slug: true } },
    },
    orderBy: [{ isPopuler: 'desc' }, { nama: 'asc' }],
  })

  return (
    <div className="bg-gray-50 min-h-screen py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">Destinasi Wisata</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Eksplorasi Destinasi Magelang
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Temukan tempat wisata terbaik di Magelang, mulai dari cagar budaya bersejarah, pesona
            lereng pegunungan, hingga kuliner khas nusantara.
          </p>
        </div>

        {/* Filter & Search Bar Area */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs mb-8">
          {/* Search Input Form */}
          <form method="GET" action="/wisata" className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="search"
                defaultValue={search || ''}
                placeholder="Cari berdasarkan nama atau lokasi wisata..."
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-all"
              />
              {kategori && <input type="hidden" name="kategori" value={kategori} />}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Cari</span>
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-gray-400 mr-2 shrink-0 font-medium">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter:</span>
            </div>

            <Link
              href={search ? `/wisata?search=${search}` : '/wisata'}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                !kategori
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Kategori
            </Link>

            {categories.map((kat) => {
              const isActive = kategori === kat.slug
              const href = search
                ? `/wisata?kategori=${kat.slug}&search=${search}`
                : `/wisata?kategori=${kat.slug}`

              return (
                <Link
                  key={kat.id}
                  href={href}
                  className={`px-3.5 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {kat.nama}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Status / Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-gray-500">
            Menampilkan <span className="font-bold text-gray-900">{destinasis.length}</span> tempat
            wisata
            {kategori && <span> dalam kategori <span className="font-semibold text-emerald-700">{activeKategoriName}</span></span>}
            {search && <span> dengan kata kunci &quot;<span className="font-semibold text-gray-900">{search}</span>&quot;</span>}
          </p>

          {(search || kategori) && (
            <Link
              href="/wisata"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Reset Filter
            </Link>
          )}
        </div>

        {/* Destinasi Grid */}
        {destinasis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {destinasis.map((destinasi) => (
              <DestinasiCard key={destinasi.id} destinasi={destinasi} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Wisata Tidak Ditemukan</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Tidak ada destinasi yang cocok dengan kata kunci atau filter yang Anda pilih. Coba
              gunakan kata kunci lain atau reset filter.
            </p>
            <Link
              href="/wisata"
              className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              Lihat Semua Destinasi
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
