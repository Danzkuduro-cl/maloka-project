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
  Tags,
  MapPin,
} from 'lucide-react'

interface KategoriItem {
  id: number
  nama: string
  slug: string
  deskripsi?: string | null
  _count?: {
    destinasis: number
  }
}

export default function AdminKategoriPage() {
  const [kategoris, setKategoris] = useState<KategoriItem[]>([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form Fields
  const [nama, setNama] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/kategori')
      const data = await res.json()
      if (data.success) setKategoris(data.data)
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
        const res = await fetch('/api/admin/kategori')
        const data = await res.json()
        if (cancelled) return
        if (data.success) setKategoris(data.data)
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
    setDeskripsi('')
    setIsModalOpen(true)
  }

  const openEditModal = (kat: KategoriItem) => {
    setEditingId(kat.id)
    setErrorMsg('')
    setNama(kat.nama)
    setDeskripsi(kat.deskripsi ?? '')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)

    try {
      const isEditing = editingId !== null
      const url = isEditing ? `/api/admin/kategori/${editingId}` : '/api/admin/kategori'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          deskripsi,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            (isEditing ? 'Gagal memperbarui kategori.' : 'Gagal menambahkan kategori.')
        )
      }

      setSuccessMsg(
        isEditing
          ? `Kategori "${nama}" berhasil diperbarui!`
          : `Kategori "${nama}" berhasil ditambahkan!`
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

  const handleDelete = async (kat: KategoriItem) => {
    const destCount = kat._count?.destinasis ?? 0
    if (destCount > 0) {
      alert(
        `Kategori "${kat.nama}" tidak dapat dihapus karena masih memiliki ${destCount} destinasi wisata aktif.`
      )
      return
    }

    if (!confirm(`Hapus kategori "${kat.nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/kategori/${kat.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setKategoris((prev) => prev.filter((k) => k.id !== kat.id))
        setSuccessMsg(`Kategori "${kat.nama}" berhasil dihapus.`)
      } else {
        alert(data.message || 'Gagal menghapus kategori.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus kategori.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Kelola Kategori Wisata
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Atur pengelompokan kategori destinasi wisata Magelang untuk memudahkan pencarian wisatawan.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
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

      {/* Tabel Kategori */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Nama Kategori</th>
                <th className="py-3.5 px-6">Slug URL</th>
                <th className="py-3.5 px-6">Deskripsi</th>
                <th className="py-3.5 px-6">Jumlah Destinasi</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat data kategori dari Supabase...</span>
                  </td>
                </tr>
              ) : kategoris.length > 0 ? (
                kategoris.map((kat) => (
                  <tr key={kat.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Tags className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-gray-900">{kat.nama}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <code className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-mono">
                        {kat.slug}
                      </code>
                    </td>
                    <td className="py-4 px-6 text-gray-500 max-w-md">
                      {kat.deskripsi || <span className="text-gray-300 italic">Tidak ada deskripsi</span>}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{kat._count?.destinasis ?? 0} Destinasi</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(kat)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Kategori"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(kat)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Belum ada kategori terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT KATEGORI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingId !== null ? 'Edit Kategori Wisata' : 'Tambah Kategori Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Slug URL akan dibuat secara otomatis dari nama kategori.
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
                <label className="block font-semibold text-gray-700 mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Desa Wisata & Balkondes"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Penjelasan singkat mengenai jenis destinasi dalam kategori ini..."
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
                  <span>{editingId !== null ? 'Simpan Perubahan' : 'Simpan Kategori'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
