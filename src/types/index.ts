// TypeScript types & interfaces untuk project Maloka

// ===== DATABASE MODELS =====

export interface Kategori {
  id: number
  nama: string
  slug: string
  deskripsi?: string | null
  createdAt: Date
  updatedAt: Date
  _count?: { destinasis: number }
}

export interface Destinasi {
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
  kategori?: Kategori
  layanans?: Layanan[]
  createdAt: Date
  updatedAt: Date
}

export type TipeLayanan = 'TIKET' | 'TOUR_GUIDE' | 'PENGINAPAN' | 'TRANSPORTASI'
export type StatusPesanan = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Layanan {
  id: number
  tipe: TipeLayanan
  nama: string
  harga: number | string
  deskripsi?: string | null
  destinasiId?: number | null
  destinasi?: Pick<Destinasi, 'id' | 'nama' | 'slug'> | null
  createdAt: Date
  updatedAt: Date
}

export interface Pesanan {
  id: number
  kodePesanan: string
  namaPemesan: string
  email: string
  telepon: string
  tanggalKunjungan: Date
  jumlahOrang: number
  totalHarga: number | string
  status: StatusPesanan
  catatan?: string | null
  detailPesanans?: DetailPesanan[]
  createdAt: Date
  updatedAt: Date
}

export interface DetailPesanan {
  id: number
  pesananId: number
  layananId: number
  jumlah: number
  subtotal: number | string
  layanan?: Pick<Layanan, 'id' | 'nama' | 'tipe' | 'harga'>
}

// ===== API RESPONSE =====

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ===== FORM PAYLOADS =====

export interface PesananPayload {
  namaPemesan: string
  email: string
  telepon: string
  tanggalKunjungan: string // ISO string
  jumlahOrang: number
  catatan?: string
  layananIds: { layananId: number; jumlah: number }[]
}

export interface UpdateStatusPesananPayload {
  status: StatusPesanan
}

// ===== LABEL HELPERS =====

export const TIPE_LAYANAN_LABEL: Record<TipeLayanan, string> = {
  TIKET: '🎫 Tiket',
  TOUR_GUIDE: '🧭 Tour Guide',
  PENGINAPAN: '🏨 Penginapan',
  TRANSPORTASI: '🚐 Transportasi',
}

export const STATUS_PESANAN_LABEL: Record<StatusPesanan, string> = {
  PENDING: '⏳ Menunggu Konfirmasi',
  CONFIRMED: '✅ Dikonfirmasi',
  CANCELLED: '❌ Dibatalkan',
}

export const STATUS_PESANAN_COLOR: Record<StatusPesanan, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}
