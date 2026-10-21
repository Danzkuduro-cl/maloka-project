/* eslint-disable @next/next/no-img-element */
'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react'

export interface DestinasiItem {
  id: number
  nama: string
  lokasi: string
  fotoUrl?: string | null
  hargaTiket: number
  kategoriNama?: string
  isPopuler?: boolean
}

interface DestinasiShowcaseProps {
  items: DestinasiItem[]
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80'

function circularOffset(i: number, active: number, n: number): number {
  if (n <= 1) return 0
  const h = Math.floor((n - 1) / 2)
  const offset = ((i - active + n + h) % n) - h
  return offset
}

export default function DestinasiShowcase({ items }: DestinasiShowcaseProps) {
  const n = items?.length || 0
  const [activeIndex, setActiveIndex] = useState(0)

  // Drag & Swipe tracking
  const dragStartX = useRef<number | null>(null)
  const dragDeltaX = useRef(0)
  const isDragging = useRef(false)

  // prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const goTo = useCallback(
    (idx: number) => {
      if (n === 0) return
      setActiveIndex(((idx % n) + n) % n)
    },
    [n]
  )

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    // FIX: Jangan inisiasi drag/pointer-capture jika yang diklik adalah
    // elemen interaktif (link Detail, tombol, dll) agar navigasi tetap jalan.
    const target = e.target as HTMLElement
    if (target.closest('a, button')) {
      return
    }
    dragStartX.current = e.clientX
    dragDeltaX.current = 0
    isDragging.current = false
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return
    dragDeltaX.current = e.clientX - dragStartX.current
    if (Math.abs(dragDeltaX.current) > 8) {
      isDragging.current = true
    }
  }

  const onPointerUp = () => {
    if (dragStartX.current === null) return
    if (isDragging.current) {
      if (dragDeltaX.current < -35) {
        next()
      } else if (dragDeltaX.current > 35) {
        prev()
      }
    }
    dragStartX.current = null
    setTimeout(() => {
      isDragging.current = false
    }, 50)
  }

  if (!items || n === 0) return null

  const transitionCls = reducedMotion
    ? ''
    : 'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]'

  return (
    <div
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 outline-hidden select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Coverflow Destinasi Populer"
    >
      {/* =====================================================================
          DESKTOP & TABLET COVERFLOW CONTAINER
      ===================================================================== */}
      <div className="hidden md:block relative w-full h-125 lg:h-132.5">
        {/* Tombol Panah Kiri */}
        {n > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prev()
            }}
            aria-label="Destinasi Sebelumnya"
            className="absolute left-[6%] lg:left-[1%] top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl text-biru-tua hover:text-tosca flex items-center justify-center transition-all hover:scale-110 active:scale-95 focus-visible:ring-2 ring-tosca cursor-pointer border border-border"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
        )}

        {/* Tombol Panah Kanan */}
        {n > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              next()
            }}
            aria-label="Destinasi Berikutnya"
            className="absolute right-[6%] lg:right-[-2%] top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl text-biru-tua hover:text-tosca flex items-center justify-center transition-all hover:scale-110 active:scale-95 focus-visible:ring-2 ring-tosca cursor-pointer border border-border"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.2]" />
          </button>
        )}

        {/* Area Kartu Coverflow */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {items.map((item, i) => {
            const offset = circularOffset(i, activeIndex, n)
            const isCenter = offset === 0
            const hidden = Math.abs(offset) > 2

            let translateX = 0
            if (offset === 0) translateX = -100
            else if (offset === 1) translateX = 270 - 60
            else if (offset === -1) translateX = -360 - 60
            else if (offset === 2) translateX = 540 - 60
            else if (offset === -2) translateX = -410 - 60
            else if (offset > 2) translateX = 600 - 60
            else if (offset < -2) translateX = -600 - 60

            let scale = 1
            let opacity = 1
            let zIndex = 30
            if (isCenter) {
              scale = 1
              opacity = 1
              zIndex = 40
            } else if (Math.abs(offset) === 1) {
              scale = 0.86
              opacity = 1
              zIndex = 20
            } else if (Math.abs(offset) === 2) {
              scale = 0.74
              opacity = 0.45
              zIndex = 10
            } else {
              scale = 0.6
              opacity = 0
              zIndex = 1
            }

            const formattedHarga =
              item.hargaTiket === 0
                ? 'Gratis'
                : `Rp ${item.hargaTiket.toLocaleString('id-ID')}`

            const cardWidthClass = isCenter ? 'w-[340px] lg:w-[380px]' : 'w-[400px] lg:w-[350px]'
            const cardHeightClass = isCenter ? 'h-[440px] lg:h-[460px]' : 'h-[410px] lg:h-[490px]'

            return (
              <div
                key={item.id}
                className={`absolute left-1/2 top-1/2 ${cardWidthClass} ${cardHeightClass} rounded-3xl overflow-hidden shrink-0 ${transitionCls} ${
                  hidden ? 'pointer-events-none' : ''
                } ${!isCenter ? 'cursor-pointer hover:opacity-95' : 'cursor-default'}`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  boxShadow: isCenter
                    ? '0 30px 70px -15px rgba(14,59,76,0.42), 0 12px 30px -6px rgba(26,163,198,0.25)'
                    : '0 12px 35px -8px rgba(14,59,76,0.22)',
                }}
                onClick={(e) => {
                  if (!isCenter && !isDragging.current) {
                    e.preventDefault()
                    e.stopPropagation()
                    goTo(i)
                  }
                }}
                aria-hidden={hidden}
              >
                {/* Gambar Destinasi */}
                <img
                  src={item.fotoUrl || FALLBACK_IMAGE}
                  alt={item.nama}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Gradient Gelap */}
                <div className="absolute inset-0 bg-linear-to-t from-biru-sangat-tua/95 via-biru-tua/40 to-transparent pointer-events-none" />

                {/* Badge Atas */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  {item.kategoriNama ? (
                    <span className="px-3.5 py-1 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-md text-white border border-white/25">
                      {item.kategoriNama}
                    </span>
                  ) : (
                    <span />
                  )}
                  {item.isPopuler && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-bintang text-biru-tua shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-biru-tua" />
                      Favorit
                    </span>
                  )}
                </div>

                {/* Konten Kartu Bagian Bawah */}
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-white/85 font-medium mb-1.5">
                    <MapPin className="w-4 h-4 text-tosca shrink-0" />
                    <span className="truncate">{item.lokasi}</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight line-clamp-1 mb-3">
                    {item.nama}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div>
                      <span className="text-[10px] text-white/70 block font-semibold uppercase tracking-wider">
                        TIKET
                      </span>
                      <span className="text-base lg:text-lg font-extrabold text-[#7FD6EE]">
                        {formattedHarga}
                      </span>
                    </div>
                    {isCenter ? (
                      <Link
                        href={`/wisata/${item.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-tosca hover:bg-tosca-tua px-5 py-2.5 rounded-full transition-all shadow-md hover:scale-105 active:scale-95"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Detail</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90 px-4 py-2 rounded-full border border-white/35 backdrop-blur-xs">
                        Lihat
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* =====================================================================
          MOBILE VIEW: TAMPILKAN 1 KARTU TENGAH FOKUS
      ===================================================================== */}
      <div className="flex md:hidden relative w-full h-95">
        {n > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prev()
            }}
            aria-label="Destinasi Sebelumnya"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/95 shadow-md text-biru-tua flex items-center justify-center cursor-pointer border border-border"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
        {n > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              next()
            }}
            aria-label="Destinasi Berikutnya"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/95 shadow-md text-biru-tua flex items-center justify-center cursor-pointer border border-border"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}

        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {items.map((item, i) => {
            const offset = circularOffset(i, activeIndex, n)
            const isCenter = offset === 0
            const hidden = Math.abs(offset) > 1
            const translateX = offset * 280
            const scale = isCenter ? 1 : 0.84
            const opacity = hidden ? 0 : isCenter ? 1 : 0.4
            const zIndex = isCenter ? 20 : 10

            const formattedHarga =
              item.hargaTiket === 0
                ? 'Gratis'
                : `Rp ${item.hargaTiket.toLocaleString('id-ID')}`

            return (
              <div
                key={item.id}
                className={`absolute left-1/2 top-1/2 w-72.5 h-90 rounded-3xl overflow-hidden ${transitionCls} ${
                  hidden ? 'pointer-events-none' : ''
                } ${!isCenter ? 'cursor-pointer' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  boxShadow: isCenter ? '0 18px 40px rgba(14,59,76,0.32)' : 'none',
                }}
                onClick={(e) => {
                  if (!isCenter && !isDragging.current) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (offset < 0) prev()
                    else next()
                  }
                }}
                aria-hidden={hidden}
              >
                <img
                  src={item.fotoUrl || FALLBACK_IMAGE}
                  alt={item.nama}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-linear-to-t from-biru-sangat-tua/95 via-biru-tua/40 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  {item.kategoriNama ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {item.kategoriNama}
                    </span>
                  ) : (
                    <span />
                  )}
                  {item.isPopuler && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-bintang text-biru-tua">
                      <Star className="w-3 h-3 fill-biru-tua" />
                      Favorit
                    </span>
                  )}
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <div className="flex items-center gap-1 text-xs text-white/80 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-tosca shrink-0" />
                    <span className="truncate">{item.lokasi}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white line-clamp-1 mb-2">
                    {item.nama}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <span className="text-sm font-extrabold text-[#7FD6EE]">
                      {formattedHarga}
                    </span>
                    {isCenter && (
                      <Link
                        href={`/wisata/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-tosca px-4 py-2 rounded-full"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots Indicator di bawah kartu */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goTo(idx)}
            aria-label={`Ke slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full h-2.5 cursor-pointer ${
              idx === activeIndex
                ? 'w-8 bg-tosca'
                : 'w-2.5 bg-biru-garis hover:bg-tosca/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}