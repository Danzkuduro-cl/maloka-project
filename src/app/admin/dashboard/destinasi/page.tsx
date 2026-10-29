'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  Search,
  Upload,
  Link2,
  ExternalLink,
  UserCheck,
  ImageIcon,
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
  alamat?: string | null
  fotoUrl?: string | null
  isPopuler: boolean
  kategoriId: number
  kategori: {
    id: number
    nama: string
  }
  admin?: {
    id: number
    nama: string
    email: string
  } | null
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=400&q=80'

// Fungsi untuk membaca & mengompresi file gambar (Landscape/Portrait/Square tetap proporsional)
function compressImageToDataUrl(file: File, maxDimension = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new window.Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Gagal memproses gambar di browser.'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('File gambar tidak valid atau rusak.'))
      img.src = event.target?.result as string
    }
    reader.onerror = () => reject(new Error('Gagal membaca file dari perangkat.'))
    reader.readAsDataURL(file)
  })
}

export default function AdminDestinasiPage() {
  const [destinasis, setDestinasis] = useState<Destinasi[]>([])
  const [categories, setCategories] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(true)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKategoriId, setFilterKategoriId] = useState('ALL')

  // Modal State (Tambah & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
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

  // Image Upload State
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    return () => {
      cancelled = true
    }
  }, [])

  // Buka modal untuk Tambah Destinasi Baru
  const openCreateModal = () => {
    setEditingId(null)
    setErrorMsg('')
    setNama('')
    setKategoriId(categories.length > 0 ? String(categories[0].id) : '')
    setHargaTiket('')
    setJamBuka('08:00')
    setJamTutup('17:00')
    setLokasi('Magelang')
    setAlamat('')
    setFotoUrl('')
    setUploadedFileName('')
    setImageInputMode('upload')
    setIsPopuler(false)
    setDeskripsi('')
    setIsModalOpen(true)
  }

  // Buka modal untuk Edit Destinasi yang sudah ada
  const openEditModal = (dest: Destinasi) => {
    setEditingId(dest.id)
    setErrorMsg('')
    setNama(dest.nama)
    setKategoriId(String(dest.kategoriId))
    setHargaTiket(String(Number(dest.hargaTiket) || 0))
    setJamBuka(dest.jamBuka)
    setJamTutup(dest.jamTutup)
    setLokasi(dest.lokasi)
    setAlamat(dest.alamat || '')
    setFotoUrl(dest.fotoUrl || '')
    setUploadedFileName(
      dest.fotoUrl?.startsWith('data:image') ? 'Foto tersimpan dari perangkat' : ''
    )
    setImageInputMode(
      dest.fotoUrl && !dest.fotoUrl.startsWith('data:image') ? 'url' : 'upload'
    )
    setIsPopuler(Boolean(dest.isPopuler))
    setDeskripsi(dest.deskripsi)
    setIsModalOpen(true)
  }

  // Handle pemrosesan file gambar saat dipilih atau di-drop
  const processSelectedFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Mohon pilih file gambar (JPG, PNG, WEBP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 10 MB.')
      return
    }

    try {
      setErrorMsg('')
      setUploadingImage(true)
      const compressedDataUrl = await compressImageToDataUrl(file)
      setFotoUrl(compressedDataUrl)
      setUploadedFileName(file.name)
    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memproses gambar.')
      }
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processSelectedFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingFile(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processSelectedFile(file)
    }
  }

  // Simpan (Tambah Baru atau Simpan Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)

    try {
      const isEditing = editingId !== null
      const url = isEditing ? `/api/admin/destinasi/${editingId}` : '/api/admin/destinasi'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
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
        throw new Error(
          data.message ||
            (isEditing ? 'Gagal memperbarui destinasi.' : 'Gagal menambahkan destinasi.')
        )
      }

      setSuccessMsg(
        isEditing
          ? `Destinasi "${nama}" berhasil diperbarui!`
          : `Destinasi "${nama}" berhasil ditambahkan!`
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
        setSuccessMsg(`Destinasi "${namaDestinasi}" berhasil dihapus.`)
      } else {
        alert(data.message || 'Gagal menghapus destinasi.')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus.')
    }
  }

  // Filter destinasi berdasarkan pencarian dan kategori
  const filteredDestinasis = destinasis.filter((dest) => {
    const matchSearch =
      dest.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
    const matchKategori =
      filterKategoriId === 'ALL' || String(dest.kategoriId) === filterKategoriId
    return matchSearch && matchKategori
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Kelola Destinasi Wisata
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Tambah, edit, unggah foto, dan kelola lokasi wisata Magelang yang tampil di website.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Destinasi</span>
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
            className="text-emerald-600 hover:text-emerald-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama destinasi atau lokasi kecamatan..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterKategoriId}
            onChange={(e) => setFilterKategoriId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-700 font-medium focus:outline-hidden focus:border-emerald-600 bg-white"
          >
            <option value="ALL">Semua Kategori ({destinasis.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-6">Foto & Nama</th>
                <th className="py-3.5 px-6">Kategori</th>
                <th className="py-3.5 px-6">Harga Tiket</th>
                <th className="py-3.5 px-6">Jam Operasional</th>
                <th className="py-3.5 px-6">Lokasi & Penginput</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
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
              ) : filteredDestinasis.length > 0 ? (
                filteredDestinasis.map((dest) => (
                  <tr key={dest.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <Image
                          src={dest.fotoUrl || DEFAULT_FALLBACK_IMAGE}
                          alt={dest.nama}
                          fill
                          unoptimized
                          className="object-cover object-center"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{dest.nama}</span>
                        {dest.isPopuler && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
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
                      {Number(dest.hargaTiket) === 0
                        ? 'Gratis'
                        : `Rp ${Number(dest.hargaTiket).toLocaleString('id-ID')}`}
                    </td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      {dest.jamBuka} - {dest.jamTutup}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-700 font-medium block max-w-xs truncate">
                        {dest.lokasi}
                      </span>
                      {dest.admin && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          <span>Oleh: {dest.admin.nama}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Link
                          href={`/wisata/${dest.id}`}
                          target="_blank"
                          className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Lihat di Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(dest)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Destinasi"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dest.id, dest.nama)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Destinasi"
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
                    Tidak ada destinasi yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT DESTINASI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingId !== null ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingId !== null
                    ? 'Perbarui informasi atau ganti foto destinasi wisata.'
                    : 'Lengkapi informasi wisata dan unggah foto terbaik.'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nama Destinasi *</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Nepal van Java"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Kategori *</label>
                  <select
                    value={kategoriId}
                    onChange={(e) => setKategoriId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Harga Tiket Masuk (Rp) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={hargaTiket}
                    onChange={(e) => setHargaTiket(e.target.value)}
                    placeholder="25000 (Isi 0 jika Gratis)"
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
                    placeholder="17:30"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* FOTO DESTINASI: UPLOAD FILE ATAU PASTE URL + LIVE PREVIEW OTOMATIS MENYESUAIKAN */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block font-semibold text-gray-800">
                    Foto Destinasi (Bebas Landscape / Portrait / Square)
                  </label>
                  <div className="inline-flex rounded-xl bg-gray-200/80 p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        imageInputMode === 'upload'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Link URL</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Area Input (Kiri) */}
                  <div className="sm:col-span-7">
                    {imageInputMode === 'upload' ? (
                      <div
                        key="mode-upload"
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDraggingFile(true)
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                          isDraggingFile
                            ? 'border-emerald-500 bg-emerald-50/70'
                            : 'border-gray-300 hover:border-emerald-500 bg-white'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {uploadingImage ? (
                          <div className="py-3 text-emerald-600">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1.5" />
                            <span className="text-xs font-semibold">
                              Mengoptimalkan ukuran gambar...
                            </span>
                          </div>
                        ) : (
                          <div className="py-2">
                            <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                            <p className="text-xs font-bold text-gray-800">
                              Klik untuk pilih foto atau tarik (drag & drop) ke sini
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Mendukung JPG, PNG, WEBP (Otomatis menyesuaikan bingkai)
                            </p>
                            {uploadedFileName && (
                              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold truncate max-w-full">
                                ✓ {uploadedFileName}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key="mode-url" className="space-y-1.5">
                        <input
                          type="url"
                          value={(fotoUrl ?? '').startsWith('data:image') ? '' : (fotoUrl ?? '')}
                          onChange={(e) => {
                            setFotoUrl(e.target.value)
                            setUploadedFileName('')
                          }}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-hidden focus:border-emerald-600"
                        />
                        <p className="text-[11px] text-gray-500">
                          Tempelkan tautan langsung gambar dari internet (Unsplash, Google, dll).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Live Preview Otomatis Menyesuaikan (Kanan) */}
                  <div className="sm:col-span-5">
                    <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gray-200 border border-gray-300 shadow-xs">
                      {fotoUrl ? (
                        <>
                          <Image
                            src={fotoUrl}
                            alt="Preview Foto Destinasi"
                            fill
                            unoptimized
                            className="object-cover object-center"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFotoUrl('')
                              setUploadedFileName('')
                            }}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                            title="Hapus Foto"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white">
                            Preview Otomatis Fit
                          </span>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-3 text-center">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[11px]">Belum ada foto dipilih</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Dusun Butuh, Temanggung, Kaliangkrik, Kabupaten Magelang"
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPopuler"
                  checked={isPopuler}
                  onChange={(e) => setIsPopuler(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <label htmlFor="isPopuler" className="font-semibold text-gray-700 cursor-pointer">
                  Tandai sebagai Destinasi Populer / Favorit di Halaman Utama
                </label>
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
                  disabled={submitting || uploadingImage}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {editingId !== null ? 'Simpan Perubahan' : 'Simpan Destinasi'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
