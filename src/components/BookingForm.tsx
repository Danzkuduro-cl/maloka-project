'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react'

interface LayananOption {
  id: number
  tipe: string
  nama: string
  harga: number | string
  deskripsi?: string | null
  destinasi?: {
    nama: string
  } | null
}

interface BookingFormProps {
  layananList: LayananOption[]
  initialLayananId?: number
}

export default function BookingForm({ layananList, initialLayananId }: BookingFormProps) {
  const router = useRouter()

  // Form states
  const [namaPemesan, setNamaPemesan] = useState('')
  const [email, setEmail] = useState('')
  const [telepon, setTelepon] = useState('')
  const [tanggalKunjungan, setTanggalKunjungan] = useState('')
  const [jumlahOrang, setJumlahOrang] = useState(1)
  const [catatan, setCatatan] = useState('')

  // Selected services: map of { [layananId]: jumlah }
  const [selectedServices, setSelectedServices] = useState<Record<number, number>>(() => {
    if (initialLayananId) {
      return { [initialLayananId]: 1 }
    }
    return {}
  })

  // Submit states
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successData, setSuccessData] = useState<{ kodePesanan: string; id: number } | null>(null)

  // Toggle selection
  const handleToggleService = (id: number) => {
    setSelectedServices((prev) => {
      const next = { ...prev }
      if (next[id]) {
        delete next[id]
      } else {
        next[id] = 1
      }
      return next
    })
  }

  // Update quantity
  const handleQuantityChange = (id: number, qty: number) => {
    if (qty < 1) return
    setSelectedServices((prev) => ({
      ...prev,
      [id]: qty,
    }))
  }

  // Calculate total price
  const totalHarga = Object.entries(selectedServices).reduce((sum, [idStr, qty]) => {
    const id = parseInt(idStr)
    const layanan = layananList.find((l) => l.id === id)
    if (!layanan) return sum
    return sum + Number(layanan.harga) * qty
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // Validations
    if (!namaPemesan || !email || !telepon || !tanggalKunjungan) {
      setErrorMsg('Harap lengkapi semua data diri pemesan.')
      return
    }

    const serviceKeys = Object.keys(selectedServices)
    if (serviceKeys.length === 0) {
      setErrorMsg('Pilih minimal satu layanan atau tiket yang ingin dipesan.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        namaPemesan,
        email,
        telepon,
        tanggalKunjungan,
        jumlahOrang: Number(jumlahOrang) || 1,
        catatan,
        layananIds: Object.entries(selectedServices).map(([id, qty]) => ({
          layananId: parseInt(id),
          jumlah: qty,
        })),
      }

      const res = await fetch('/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal membuat pesanan.')
      }

      setSuccessData({
        kodePesanan: data.data.kodePesanan,
        id: data.data.id,
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Terjadi kesalahan koneksi.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (successData) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-100 shadow-xl text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Pesanan Berhasil Dibuat
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
          Terima Kasih, {namaPemesan}!
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Pesanan layanan wisata Magelang Anda telah tercatat dalam sistem kami.
        </p>

        {/* Invoice Code Banner */}
        <div className="my-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs text-emerald-800 font-semibold block">Kode Pesanan Anda:</span>
          <span className="text-2xl font-black text-emerald-950 tracking-wider font-mono mt-0.5 block select-all">
            {successData.kodePesanan}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            Simpan kode ini untuk melakukan pengecekan status pesanan.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push(`/cek-pesanan?kode=${successData.kodePesanan}`)}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Lihat Invoice Pesanan
          </button>
          <button
            onClick={() => {
              setSuccessData(null)
              setSelectedServices({})
            }}
            className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
          >
            Buat Pesanan Baru
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. DATA PEMESAN */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
        <h3 className="text-lg font-bold text-gray-900 mb-1">1. Data Pemesan</h3>
        <p className="text-xs text-gray-500 mb-6">
          Isi data diri Anda untuk konfirmasi pesanan dan tiket elektronik.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={namaPemesan}
              onChange={(e) => setNamaPemesan(e.target.value)}
              placeholder="Contoh: Zidan Al Mahbubi"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-600 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-600 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nomor WhatsApp / HP <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              placeholder="081234567890"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-600 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Tanggal Kunjungan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={tanggalKunjungan}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setTanggalKunjungan(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-600 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Jumlah Wisatawan (Orang) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={jumlahOrang}
              onChange={(e) => setJumlahOrang(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-600 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Catatan Tambahan (Opsional)
            </label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Butuh penjemputan di Stasiun Tugu"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-600 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. PILIH LAYANAN */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900">2. Pilih Layanan & Tiket</h3>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {Object.keys(selectedServices).length} Layanan Dipilih
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Centang layanan yang ingin Anda masukkan ke dalam paket perjalanan wisata ini.
        </p>

        <div className="space-y-3">
          {layananList.map((layanan) => {
            const isSelected = !!selectedServices[layanan.id]
            const qty = selectedServices[layanan.id] || 1
            const price = Number(layanan.harga) || 0

            return (
              <div
                key={layanan.id}
                onClick={() => handleToggleService(layanan.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600/30'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-5 h-5 rounded-md text-emerald-600 border-gray-300 focus:ring-emerald-500 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {layanan.tipe}
                      </span>
                      {layanan.destinasi && (
                        <span className="text-[11px] text-emerald-700 font-medium">
                          📍 {layanan.destinasi.nama}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">{layanan.nama}</h4>
                    {layanan.deskripsi && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {layanan.deskripsi}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 shrink-0 gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm font-black text-emerald-700">
                    Rp {price.toLocaleString('id-ID')}
                  </span>

                  {isSelected && (
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                      <span className="text-[11px] text-gray-500 font-medium">Jml:</span>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={qty}
                        onChange={(e) =>
                          handleQuantityChange(layanan.id, parseInt(e.target.value) || 1)
                        }
                        className="w-12 text-center text-xs font-bold border-b border-gray-300 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. TOTAL & SUBMIT BAR */}
      <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs text-emerald-300 uppercase tracking-wider font-semibold block">
            Total Estimasi Biaya
          </span>
          <span className="text-3xl font-black text-white mt-1 block">
            Rp {totalHarga.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-emerald-300/80 mt-0.5 block">
            {Object.keys(selectedServices).length} layanan dipilih • Termasuk konfirmasi pemandu
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-sm shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses Pesanan...</span>
            </>
          ) : (
            <>
              <span>Konfirmasi & Buat Pesanan</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
