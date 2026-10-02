import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import BookingForm from '@/components/BookingForm'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default async function PesanPage({
  searchParams,
}: {
  searchParams: Promise<{ layananId?: string }>
}) {
  const { layananId } = await searchParams
  const initialLayananId = layananId ? parseInt(layananId) : undefined

  // Ambil semua layanan yang tersedia dari database
  const layanans = await prisma.layanan.findMany({
    include: {
      destinasi: { select: { nama: true } },
    },
    orderBy: [{ tipe: 'asc' }, { harga: 'asc' }],
  })

  // Format Decimal ke string/number agar serializable ke client component
  const formattedLayanans = layanans.map((l) => ({
    id: l.id,
    tipe: l.tipe,
    nama: l.nama,
    harga: Number(l.harga),
    deskripsi: l.deskripsi,
    destinasi: l.destinasi ? { nama: l.destinasi.nama } : null,
  }))

  return (
    <div className="bg-gray-50 min-h-screen py-10 lg:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Heading */}
        <div className="mb-8">
          <Link
            href="/wisata"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Destinasi</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Layanan Travel Agent Resmi
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-2">
            Form Pemesanan Wisata Magelang
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Pilih paket tiket destinasi, jasa pemandu wisata berlisensi, penginapan joglo, atau sewa
            jeep sunrise dalam satu langkah mudah.
          </p>
        </div>

        {/* Client Booking Form */}
        <BookingForm
          layananList={formattedLayanans}
          initialLayananId={initialLayananId}
        />
      </div>
    </div>
  )
}
