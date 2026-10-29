'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  Search,
  Ticket,
  UserCheck,
  Home,
  Car,
  Globe,
  MapPin,
} from 'lucide-react'

type TipeLayananType = 'TIKET' | 'TOUR_GUIDE' | 'PENGINAPAN' | 'TRANSPORTASI'

interface DestinasiOption {
  id: number
  nama: string
  lokasi: string
}

interface LayananItem {
  id: number
  nama: string
  tipe: TipeLayananType
  harga: number | string
  deskripsi?: string | null
  destinasiId?: number | null
  destinasi?: {
    id: number
    nama: string
    lokasi: string
  } | null
  _count?: {
    detailPesanans: number
  }
}

const TIPE_LABELS: Record<TipeLayananType, string> = {
  TIKET: 'Tiket Masuk',
  TOUR_GUIDE: 'Tour Guide',
  PENGINAPAN: 'Penginapan',
  TRANSPORTASI: 'Transportasi',
}

export default function AdminLayananPage() {
  const [layanans, setLayanans] = useState<LayananItem[]>([])
  const [destinasis, setDestinasis] = useState<DestinasiOption[]>([])
  const [loading, setLoading] = useState(true)

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTipe, setActiveTipe] = useState<'ALL' | TipeLayananType>('ALL')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form Fields
  const [nama, setNama] = useState('')
  const [tipe, setTipe] = useState<TipeLayananType>('TIKET')
  const [harga, setHarga] = useState('')
  const [destinasiId, setDestinasiId] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [resLay, resDest] = await Promise.all([
        fetch('/api/admin/layanan'),
        fetch('/api/admin/destinasi'),
      ])
      const dataLay = await resLay.json()
      const dataDest = await resDest.json()

      if (dataLay.success) setLayanans(dataLay.data)
      if (dataDest.success) setDestinasis(dataDest.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const [resLay, resDest] = await Promise.all([
          fetch('/api/admin/layanan'),
          fetch('/api/admin/destinasi'),
        ])
        const dataLay = await resLay.json()
        const dataDest = await resDest.json()
        if (cancelled) return
        if (dataLay.success) setLayanans(dataLay.data)
        if (dataDest.success) setDestinasis(dataDest.data)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const openCreateModal = () => {
    setEditingId(null)
    setErrorMsg('')
    setNama('')
    setTipe('TIKET')
    setHarga('')
    setDestinasiId('')
    setDeskripsi('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: LayananItem) => {
    setEditingId(item.id)
    setErrorMsg('')
    setNama(item.nama)
    setTipe(item.tipe)
    setHarga(String(Number(item.harga) || 0))
    setDestinasiId(item.destinasiId ? String(item.destinasiId) : '')
    setDeskripsi(item.deskripsi ?? '')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)

    try {
      const isEditing = editingId !== null
      const url = isEditing ? `/api/admin/layanan/${editingId}` : '/api/admin/layanan'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          tipe,
          harga: parseFloat(harga) || 0,
          destinasiId: destinasiId ? parseInt(destinasiId) : null,
          deskripsi,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            (isEditing ? 'Gagal memperbarui layanan.' : 'Gagal menambahkan layanan.')
        )
      }

      setSuccessMsg(
        isEditing
          ? `Layanan "${nama}" berhasil diperbarui!`
          : `Layanan "${nama}" berhasil ditambahkan!`
      )
      setIsModalOpen(false)
      setEditingId(null)
      fetchData()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Terjadi kesalahan.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (item: LayananItem) => {
    if (!confirm(`Hapus layanan "${item.nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/layanan/${item.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setLayanans((prev) => prev.filter((l) => l.id !== item.id))
        setSuccessMsg(`Layanan "${item.nama}" berhasil dihapus.`)
      } else {
        alert(data.message || 'Gagal menghapus layanan.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus layanan.')
    }
  }

  const renderTipeBadge = (tipeVal: TipeLayananType) => {
    switch (tipeVal) {
      case 'TIKET':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Ticket className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tiket Masuk</span>
          </span>
        )
      case 'TOUR_GUIDE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Tour Guide</span>
          </span>
        )
      case 'PENGINAPAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Home className="w-3.5 h-3.5 text-amber-600" />
            <span>Penginapan</span>
          </span>
        )
      case 'TRANSPORTASI':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            <Car className="w-3.5 h-3.5 text-purple-600" />
            <span>Transportasi</span>
          </span>
        )
    }
  }

  const filteredLayanans = layanans.filter((l) => {
    const matchTipe = activeTipe === 'ALL' || l.tipe === activeTipe
    const matchSearch =
      l.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.destinasi?.nama ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.deskripsi ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchTipe && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Kelola Layanan & Paket Wisata
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Atur daftar tiket masuk, tour guide, penginapan, dan transportasi untuk pemesanan wisatawan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Notifikasi Sukses */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3 text-xs font-semibold">
          {(['ALL', 'TIKET', 'TOUR_GUIDE', 'PENGINAPAN', 'TRANSPORTASI'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTipe(tab)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTipe === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              {tab === 'ALL' ? `Semua Layanan (${layanans.length})` : TIPE_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama layanan, deskripsi, atau nama destinasi terkait..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Tabel Layanan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Nama Layanan & Deskripsi</th>
                <th className="py-3.5 px-6">Tipe Layanan</th>
                <th className="py-3.5 px-6">Destinasi Terkait</th>
                <th className="py-3.5 px-6">Harga Paket</th>
                <th className="py-3.5 px-6">Dipesan</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat data layanan dari Supabase...</span>
                  </td>
                </tr>
              ) : filteredLayanans.length > 0 ? (
                filteredLayanans.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 max-w-md">
                      <span className="font-bold text-gray-900 block">{item.nama}</span>
                      {item.deskripsi && (
                        <span className="text-xs text-gray-500 line-clamp-2 mt-0.5 block">
                          {item.deskripsi}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{renderTipeBadge(item.tipe)}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.destinasi ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.destinasi.nama}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Umum (Semua Wisata)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900 whitespace-nowrap">
                      Rp {Number(item.harga).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        {item._count?.detailPesanans ?? 0}x transaksi
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Layanan"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Layanan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada layanan yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT LAYANAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingId !== null ? 'Edit Layanan Wisata' : 'Tambah Layanan Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Layanan ini akan tampil sebagai pilihan paket di formulir pemesanan wisatawan.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nama Layanan / Paket *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Sewa Jeep Sunrise Punthuk Setumbu"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tipe Layanan *</label>
                  <select
                    value={tipe}
                    onChange={(e) => setTipe(e.target.value as TipeLayananType)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600 bg-white"
                  >
                    <option value="TIKET">Tiket Masuk</option>
                    <option value="TOUR_GUIDE">Tour Guide (Pemandu)</option>
                    <option value="PENGINAPAN">Penginapan (Homestay/Villa)</option>
                    <option value="TRANSPORTASI">Transportasi (Jeep/Shuttle)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Harga Layanan (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="150000"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Destinasi Wisata Terkait (Opsional)
                </label>
                <select
                  value={destinasiId}
                  onChange={(e) => setDestinasiId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600 bg-white"
                >
                  <option value="">🌐 Layanan Umum / Berlaku untuk Semua Destinasi</option>
                  {destinasis.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      📍 {d.nama} ({d.lokasi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deskripsi Fasilitas</label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Rincian fasilitas, durasi layanan, atau kapasitas penumpang..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId !== null ? 'Simpan Perubahan' : 'Simpan Layanan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
