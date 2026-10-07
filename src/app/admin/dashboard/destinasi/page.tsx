'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

interface Kategori {
  id: number
  nama: string
}

interface Destinasi {
  id: number
  nama: string
  slug: string
  deskripsi: string
  hargaTiket: number | string
  jamBuka: string
  jamTutup: string
  lokasi: string
  fotoUrl?: string | null
  isPopuler: boolean
  kategoriId: number
  kategori: {
    id: number
    nama: string
  }
}

export default function AdminDestinasiPage() {
  const [destinasis, setDestinasis] = useState<Destinasi[]>([])
  const [categories, setCategories] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form Fields
  const [nama, setNama] = useState('')
  const [kategoriId, setKategoriId] = useState('')
  const [hargaTiket, setHargaTiket] = useState('')
  const [jamBuka, setJamBuka] = useState('08:00')
  const [jamTutup, setJamTutup] = useState('17:00')
  const [lokasi, setLokasi] = useState('Magelang')
  const [alamat, setAlamat] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [isPopuler, setIsPopuler] = useState(false)
  const [deskripsi, setDeskripsi] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [resDest, resKat] = await Promise.all([
        fetch('/api/admin/destinasi'),
        fetch('/api/kategori'),
      ])
      const dataDest = await resDest.json()
      const dataKat = await resKat.json()

      if (dataDest.success) setDestinasis(dataDest.data)
      if (dataKat.success) {
        setCategories(dataKat.data)
        if (dataKat.data.length > 0 && !kategoriId) {
          setKategoriId(String(dataKat.data[0].id))
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [kategoriId])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const [resDest, resKat] = await Promise.all([
          fetch('/api/admin/destinasi'),
          fetch('/api/kategori'),
        ])
        const dataDest = await resDest.json()
        const dataKat = await resKat.json()
        if (cancelled) return
        if (dataDest.success) setDestinasis(dataDest.data)
        if (dataKat.success) {
          setCategories(dataKat.data)
          if (dataKat.data.length > 0) {
            setKategoriId((prev) => prev || String(dataKat.data[0].id))
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])


  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/destinasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          kategoriId: parseInt(kategoriId),
          hargaTiket: parseFloat(hargaTiket) || 0,
          jamBuka,
          jamTutup,
          lokasi,
          alamat,
          fotoUrl,
          isPopuler,
          deskripsi,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menambahkan destinasi.')
      }

      setSuccessMsg('Destinasi baru berhasil ditambahkan!')
      setIsModalOpen(false)
      // Reset form
      setNama('')
      setHargaTiket('')
      setDeskripsi('')
      setAlamat('')
      setFotoUrl('')
      setIsPopuler(false)
      // Refresh list
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

  const handleDelete = async (id: number, namaDestinasi: string) => {
    if (!confirm(`Hapus destinasi "${namaDestinasi}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/destinasi/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setDestinasis((prev) => prev.filter((d) => d.id !== id))
      } else {
        alert(data.message || 'Gagal menghapus destinasi.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Kelola Destinasi Wisata
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Tambah, edit, dan kelola lokasi wisata Magelang yang tampil di website.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Destinasi</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Foto & Nama</th>
                <th className="py-3 px-6">Kategori</th>
                <th className="py-3 px-6">Harga Tiket</th>
                <th className="py-3 px-6">Jam Operasional</th>
                <th className="py-3 px-6">Lokasi</th>
                <th className="py-3 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat data destinasi dari cloud Supabase...</span>
                  </td>
                </tr>
              ) : destinasis.length > 0 ? (
                destinasis.map((dest) => (
                  <tr key={dest.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <Image
                        src={dest.fotoUrl || 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=100&q=80'}
                        alt={dest.nama}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block">{dest.nama}</span>
                        {dest.isPopuler && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                            <Sparkles className="w-3 h-3" />
                            Favorit
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {dest.kategori?.nama}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900 whitespace-nowrap">
                      Rp {Number(dest.hargaTiket).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      {dest.jamBuka} - {dest.jamTutup}
                    </td>
                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{dest.lokasi}</td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(dest.id, dest.nama)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Destinasi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Belum ada destinasi. Klik &quot;Tambah Destinasi&quot; untuk membuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH DESTINASI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-gray-900">Tambah Destinasi Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
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

            <form onSubmit={handleCreate} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nama Destinasi *</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Silancur Highland"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={kategoriId}
                    onChange={(e) => setKategoriId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Harga Tiket Masuk (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={hargaTiket}
                    onChange={(e) => setHargaTiket(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Lokasi Singkat *</label>
                  <input
                    type="text"
                    required
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Kaliangkrik, Magelang"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Jam Buka *</label>
                  <input
                    type="text"
                    required
                    value={jamBuka}
                    onChange={(e) => setJamBuka(e.target.value)}
                    placeholder="06:00"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Jam Tutup *</label>
                  <input
                    type="text"
                    required
                    value={jamTutup}
                    onChange={(e) => setJamTutup(e.target.value)}
                    placeholder="18:00"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">URL Foto (Unsplash/Web)</label>
                <input
                  type="url"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Dusun Dadapan, Mangli, Kaliangkrik, Magelang"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deskripsi Lengkap *</label>
                <textarea
                  required
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Penjelasan daya tarik dan pesona tempat wisata ini..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPopuler"
                  checked={isPopuler}
                  onChange={(e) => setIsPopuler(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <label htmlFor="isPopuler" className="font-semibold text-gray-700">
                  Tandai sebagai Destinasi Populer / Favorit di Halaman Utama
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Destinasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
