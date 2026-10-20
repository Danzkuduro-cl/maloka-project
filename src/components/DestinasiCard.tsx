import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Heart } from 'lucide-react'

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

  const fotoUrl =
    destinasi.fotoUrl ||
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80'

  const lokasiRingkas = destinasi.lokasi.split(',')[0].trim()

  return (
    <Link
      href={`/wisata/${destinasi.id}`}
      className="group relative block aspect-3/4 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Background Image Full Cover */}
      <Image
        src={fotoUrl}
        alt={destinasi.nama}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 25vw"
        loading="lazy"
        unoptimized
      />

      {/* Dark Gradient Overlay for optimal legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 via-55% to-black/15" />

      {/* Top Badges: Category pill & Heart button */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
        {destinasi.kategori ? (
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 shadow-xs">
            {destinasi.kategori.nama}
          </span>
        ) : (
          <span />
        )}
        <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors group-hover:bg-white/20">
          <Heart className="w-4 h-4 stroke-2" />
        </div>
      </div>

      {/* Bottom Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end z-10">
        {/* Title, Location & Price Row */}
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 leading-snug drop-shadow-sm group-hover:text-[#9BE3F5] transition-colors">
              {destinasi.nama}
            </h3>
            <p className="text-xs text-white/80 line-clamp-1 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#9BE3F5] shrink-0" />
              <span>{lokasiRingkas}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-black text-[#9BE3F5] leading-none drop-shadow-xs">
              {formattedHarga}
            </span>
            {hargaNumber > 0 && (
              <span className="text-[10px] text-white/70 block mt-0.5 font-normal">
                / orang
              </span>
            )}
          </div>
        </div>

        {/* Full-width Rounded White Button */}
        <div className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-white group-hover:bg-tosca text-biru-tua group-hover:text-white font-bold text-xs sm:text-sm text-center shadow-md transition-all duration-300">
          Detail Wisata
        </div>
      </div>
    </Link>
  )
}