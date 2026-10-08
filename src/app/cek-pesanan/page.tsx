import { prisma } from '@/lib/prisma'
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  User,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CekPesananPage({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>
}) {
  const { kode } = await searchParams
  const searchKode = kode?.trim()

  let pesanan = null
  let notFoundError = false

  if (searchKode) {
    pesanan = await prisma.pesanan.findFirst({
      where: { kodePesanan: searchKode.toUpperCase() },
      include: {
        detailPesanans: {
          include: {
            layanan: {
              include: {
                destinasi: { select: { nama: true } },
              },
            },
          },
        },
      },
    })

    if (!pesanan) {
      notFoundError = true
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Pesanan Dikonfirmasi
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-4 h-4 text-red-600" />
            Pesanan Dibatalkan
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600" />
            Menunggu Verifikasi
          </span>
        )
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 lg:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Layanan Pelanggan
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
            Cek Status & Invoice Pesanan
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Masukkan kode pesanan Anda (contoh:{' '}
            <span className="font-mono font-bold text-gray-800">MLK-20261002-001</span>) untuk
            melihat rincian tiket dan status konfirmasi.
          </p>
        </div>

        {/* Search Box Form */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs mb-8">
          <form method="GET" action="/cek-pesanan" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="kode"
                defaultValue={searchKode || ''}
                placeholder="Masukkan kode pesanan (misal: MLK-20261002-001)..."
                required
                className="w-full pl-11 pr-4 py-3 text-sm font-mono uppercase bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-all"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Periksa Pesanan</span>
            </button>
          </form>
        </div>

        {/* Not Found State */}
        {notFoundError && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center mb-8">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-red-900">Pesanan Tidak Ditemukan</h3>
            <p className="text-xs text-red-700 mt-1">
              Tidak ada data dengan kode pesanan &quot;{searchKode}&quot;. Pastikan kode yang Anda
              masukkan sudah sesuai dengan bukti pemesanan.
            </p>
          </div>
        )}

        {/* Pesanan Invoice Result */}
        {pesanan && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            {/* Header Invoice */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
                  Bukti Pesanan Wisata
                </span>
                <h2 className="text-2xl font-black tracking-wider font-mono mt-0.5">
                  {pesanan.kodePesanan}
                </h2>
                <span className="text-xs text-emerald-200 mt-1 block">
                  Dibuat pada:{' '}
                  {new Date(pesanan.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  WIB
                </span>
              </div>

              <div>{getStatusBadge(pesanan.status)}</div>
            </div>

            {/* Customer & Visit Info */}
            <div className="p-6 sm:p-8 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                  Data Pemesan
                </span>
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pesanan.namaPemesan}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pesanan.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pesanan.telepon}</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                  Jadwal Kunjungan
                </span>
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {new Date(pesanan.tanggalKunjungan).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Jumlah Wisatawan:{' '}
                  <span className="font-bold text-gray-800">{pesanan.jumlahOrang} Orang</span>
                </div>
                {pesanan.catatan && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                    <span className="font-semibold text-gray-700 block mb-0.5">Catatan:</span>
                    {pesanan.catatan}
                  </div>
                )}
              </div>
            </div>

            {/* List Detail Pesanan */}
            <div className="p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-4">
                Rincian Layanan & Tiket
              </span>

              <div className="divide-y divide-gray-100">
                {pesanan.detailPesanans.map((item) => {
                  const subtotal = Number(item.subtotal) || 0
                  return (
                    <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 mr-2">
                          {item.layanan.tipe}
                        </span>
                        {item.layanan.destinasi && (
                          <span className="text-xs text-emerald-700 font-medium">
                            {item.layanan.destinasi.nama}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-gray-900 mt-1">
                          {item.layanan.nama}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {item.jumlah} x Rp {Number(item.layanan.harga).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <span className="text-sm font-extrabold text-gray-900 shrink-0">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Total Calculation */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Total Pembayaran</span>
                  <span className="text-xs text-emerald-600 font-semibold">
                    Termasuk administrasi travel agent
                  </span>
                </div>
                <span className="text-2xl font-black text-emerald-700">
                  Rp {Number(pesanan.totalHarga).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Jika ada perubahan jadwal, harap hubungi Customer Care Maloka via WhatsApp.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
