'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Phone,
  Mail,
} from 'lucide-react'

interface DetailItem {
  id: number
  jumlah: number
  subtotal: number | string
  layanan: {
    nama: string
    tipe: string
    harga: number | string
  }
}

interface Pesanan {
  id: number
  kodePesanan: string
  namaPemesan: string
  email: string
  telepon: string
  tanggalKunjungan: string
  jumlahOrang: number
  totalHarga: number | string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  catatan?: string | null
  createdAt: string
  detailPesanans: DetailItem[]
}

export default function AdminPesananPage() {
  const [pesanans, setPesanans] = useState<Pesanan[]>([])
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [alertMsg, setAlertMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const url = activeTab === 'ALL' ? '/api/admin/pesanan' : `/api/admin/pesanan?status=${activeTab}`
        const res = await fetch(url)
        const data = await res.json()
        if (cancelled) return
        if (data.success) setPesanans(data.data)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [activeTab])


  const handleUpdateStatus = async (id: number, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      setUpdatingId(id)
      const res = await fetch(`/api/admin/pesanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        setPesanans((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        )
        setAlertMsg(`Pesanan berhasil diubah menjadi ${status}`)
        setTimeout(() => setAlertMsg(''), 4000)
      } else {
        alert(data.message || 'Gagal mengubah status.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Dikonfirmasi
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5" />
            Dibatalkan
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-3.5 h-3.5" />
            Menunggu
          </span>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Kelola Pesanan Wisata
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Pantau status reservasi, verifikasi pembayaran, dan ubah status pesanan wisatawan.
        </p>
      </div>

      {alertMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'ALL'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Semua Pesanan
        </button>
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'PENDING'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Menunggu Konfirmasi
        </button>
        <button
          onClick={() => setActiveTab('CONFIRMED')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'CONFIRMED'
              ? 'bg-green-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Dikonfirmasi
        </button>
        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'CANCELLED'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          Dibatalkan
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Kode & Pemesan</th>
                <th className="py-3 px-6">Kontak</th>
                <th className="py-3 px-6">Kunjungan</th>
                <th className="py-3 px-6">Rincian Layanan</th>
                <th className="py-3 px-6">Total Harga</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat data pesanan dari Supabase...</span>
                  </td>
                </tr>
              ) : pesanans.length > 0 ? (
                pesanans.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-emerald-700 block text-xs">
                        {p.kodePesanan}
                      </span>
                      <span className="font-bold text-gray-900 block mt-0.5">{p.namaPemesan}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{p.telepon}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{p.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-xs">
                      <span className="font-semibold text-gray-900 block">
                        {new Date(p.tanggalKunjungan).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-gray-400">{p.jumlahOrang} Orang</span>
                    </td>
                    <td className="py-4 px-6 text-xs max-w-xs">
                      <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                        {p.detailPesanans.map((d) => (
                          <li key={d.id} className="truncate">
                            {d.jumlah}x {d.layanan.nama}
                          </li>
                        ))}
                      </ul>
                      {p.catatan && (
                        <span className="text-[11px] text-gray-400 italic block mt-1">
                          Catatan: {p.catatan}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900 whitespace-nowrap">
                      Rp {Number(p.totalHarga).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(p.status)}</td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'CONFIRMED')}
                            disabled={updatingId === p.id}
                            className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg text-xs transition-colors border border-green-200"
                            title="Konfirmasi Pesanan"
                          >
                            Konfirmasi
                          </button>
                        )}
                        {p.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'CANCELLED')}
                            disabled={updatingId === p.id}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs transition-colors border border-red-200"
                            title="Batalkan Pesanan"
                          >
                            Batalkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Tidak ada pesanan dengan filter status ini.
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
