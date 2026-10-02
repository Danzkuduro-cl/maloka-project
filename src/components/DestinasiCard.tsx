import Link from 'next/link'
import { MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react'

interface DestinasiCardProps {
  destinasi: {
    id: number
    nama: string
    slug: string
    deskripsi: string
    hargaTiket: unknown
    jamBuka: string
    jamTutup: string
    lokasi: string
    fotoUrl?: string | null
    isPopuler?: boolean
    kategori?: {
      id: number
      nama: string
      slug: string
    } | null
  }
}

export default function DestinasiCard({ destinasi }: DestinasiCardProps) {
  const hargaNumber = Number(destinasi.hargaTiket) || 0
  const formattedHarga =
    hargaNumber === 0 ? 'Gratis' : `Rp ${hargaNumber.toLocaleString('id-ID')}`

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image & Badge container */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={
            destinasi.fotoUrl ||
            'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80'
          }
          alt={destinasi.nama}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {destinasi.kategori && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/95 text-emerald-800 backdrop-blur-xs shadow-xs">
              {destinasi.kategori.nama}
            </span>
          )}
          {destinasi.isPopuler && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              Favorit
            </span>
          )}
        </div>

        {/* Operating hours pill at bottom of image */}
        <div className="absolute bottom-3 left-3 text-xs text-white/90 font-medium flex items-center gap-1 drop-shadow-md">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {destinasi.jamBuka} - {destinasi.jamTutup} WIB
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{destinasi.lokasi}</span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {destinasi.nama}
          </h3>

          <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {destinasi.deskripsi}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Tiket Masuk</span>
            <span className="text-base font-extrabold text-emerald-700">{formattedHarga}</span>
          </div>

          <Link
            href={`/wisata/${destinasi.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs group-hover:shadow-md"
          >
            Detail
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
