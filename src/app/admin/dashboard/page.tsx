import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import {
  Users,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export default async function AdminDashboardOverviewPage() {
  const [totalPesanan, totalDestinasi, pendingCount, allConfirmedOrders, recentOrders] =
    await Promise.all([
      prisma.pesanan.count(),
      prisma.destinasi.count(),
      prisma.pesanan.count({ where: { status: 'PENDING' } }),
      prisma.pesanan.findMany({
        where: { status: 'CONFIRMED' },
        select: { totalHarga: true },
      }),
      prisma.pesanan.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          detailPesanans: {
            include: { layanan: { select: { nama: true } } },
          },
        },
      }),
    ])

  // Total pendapatan dari pesanan yang terkonfirmasi
  const totalOmset = allConfirmedOrders.reduce(
    (sum, o) => sum + (Number(o.totalHarga) || 0),
    0
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-green-100 text-green-800">
            Dikonfirmasi
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-800">
            Dibatalkan
          </span>
        )
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-yellow-100 text-yellow-800">
            Menunggu
          </span>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Pantau performa layanan wisata, omset transaksi, dan pesanan terbaru di Maloka.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Omset */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
              Omset Terkonfirmasi
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              Rp {totalOmset.toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dari pesanan aktif</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Total Pesanan */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
              Total Booking
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{totalPesanan}</span>
            <span className="text-[11px] text-gray-500 mt-1 block">Pesanan terdaftar</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Menunggu Konfirmasi */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
              Perlu Diproses
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
            <span className="text-[11px] text-amber-600 font-medium mt-1 block">
              Status Menunggu (Pending)
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Destinasi */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
              Destinasi Aktif
            </span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{totalDestinasi}</span>
            <span className="text-[11px] text-gray-500 mt-1 block">Lokasi wisata Magelang</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pesanan Masuk Terbaru</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Daftar reservasi tiket & paket wisata terakhir dari wisatawan
            </p>
          </div>
          <Link
            href="/admin/dashboard/pesanan"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Kode Pesanan</th>
                <th className="py-3 px-6">Nama Pemesan</th>
                <th className="py-3 px-6">Layanan</th>
                <th className="py-3 px-6">Kunjungan</th>
                <th className="py-3 px-6">Total Harga</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentOrders.length > 0 ? (
                recentOrders.map((pesanan) => (
                  <tr key={pesanan.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">
                      {pesanan.kodePesanan}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900 block">
                        {pesanan.namaPemesan}
                      </span>
                      <span className="text-xs text-gray-400 block">{pesanan.telepon}</span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate">
                      {pesanan.detailPesanans.map((d) => d.layanan.nama).join(', ')}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {new Date(pesanan.tanggalKunjungan).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900 whitespace-nowrap">
                      Rp {Number(pesanan.totalHarga).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(pesanan.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Belum ada pesanan yang masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
