import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import {
  MapPin,
  Clock,
  Ticket,
  Users,
  Home,
  Truck,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

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

  const hargaNumber = Number(destinasi.hargaTiket) || 0
  const formattedHarga =
    hargaNumber === 0 ? 'Gratis' : `Rp ${hargaNumber.toLocaleString('id-ID')}`

  const getTipeIcon = (tipe: string) => {
    switch (tipe) {
      case 'TIKET':
        return <Ticket className="w-5 h-5 text-emerald-600" />
      case 'TOUR_GUIDE':
        return <Users className="w-5 h-5 text-teal-600" />
      case 'PENGINAPAN':
        return <Home className="w-5 h-5 text-amber-600" />
      case 'TRANSPORTASI':
        return <Truck className="w-5 h-5 text-indigo-600" />
      default:
        return <Ticket className="w-5 h-5 text-emerald-600" />
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Image Banner */}
      <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] w-full bg-gray-900 overflow-hidden">
        <Image
          src={
            destinasi.fotoUrl ||
            'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1600&q=80'
          }
          alt={destinasi.nama}
          fill
          className="object-cover opacity-75"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/30" />

        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            href="/wisata"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Destinasi</span>
          </Link>
        </div>

        {/* Title over Hero */}
        <div className="absolute bottom-8 left-4 sm:left-8 right-4 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500 text-white shadow-sm">
              {destinasi.kategori.nama}
            </span>
            {destinasi.isPopuler && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-400 text-gray-900 shadow-sm">
                Destinasi Favorit
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {destinasi.nama}
          </h1>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-200 mt-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{destinasi.lokasi}</span>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info & Deskripsi */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Harga Tiket Masuk</span>
                <span className="text-lg font-black text-emerald-700 mt-0.5 block">
                  {formattedHarga}
                </span>
                <span className="text-[11px] text-gray-400">per orang</span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block font-medium">Jam Operasional</span>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-800 mt-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>
                    {destinasi.jamBuka} - {destinasi.jamTutup} WIB
                  </span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-gray-400 block font-medium">Kategori</span>
                <span className="text-sm font-bold text-gray-800 mt-1 block">
                  {destinasi.kategori.nama}
                </span>
              </div>
            </div>

            {/* Deskripsi Lengkap */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang {destinasi.nama}</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                {destinasi.deskripsi}
              </p>

              {destinasi.alamat && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Alamat Lengkap
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{destinasi.alamat}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Daftar Layanan Terkait Destinasi */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Paket & Layanan di Destinasi Ini
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Pesan tiket, pemandu wisata, atau penginapan resmi langsung melalui Maloka.
                  </p>
                </div>
              </div>

              {destinasi.layanans.length > 0 ? (
                <div className="space-y-4">
                  {destinasi.layanans.map((layanan) => {
                    const price = Number(layanan.harga) || 0
                    return (
                      <div
                        key={layanan.id}
                        className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                            {getTipeIcon(layanan.tipe)}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {layanan.tipe}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 mt-1">
                              {layanan.nama}
                            </h4>
                            {layanan.deskripsi && (
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {layanan.deskripsi}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200/60 shrink-0">
                          <span className="text-sm font-extrabold text-emerald-700">
                            Rp {price.toLocaleString('id-ID')}
                          </span>
                          <Link
                            href={`/pesan?layananId=${layanan.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors mt-1"
                          >
                            Pesan <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-4 text-center">
                  Layanan khusus untuk destinasi ini dapat dipesan melalui form pemesanan umum.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-md">
              <h3 className="text-lg font-black text-gray-900 mb-2">Rencanakan Perjalanan</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Pesan tiket, pemandu wisata resmi HPI, dan transportasi keliling Magelang dalam satu
                langkah mudah.
              </p>

              <div className="space-y-3 mb-6 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Konfirmasi pesanan langsung via WhatsApp & Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Jaminan tiket & layanan resmi travel agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Jadwal fleksibel sesuai preferensi Anda</span>
                </div>
              </div>

              <Link
                href="/pesan"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/30 transition-all hover:scale-[1.02]"
              >
                <span>Pesan Layanan Liburan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cek-pesanan"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-xs transition-colors mt-2"
              >
                Sudah punya kode pesanan?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
