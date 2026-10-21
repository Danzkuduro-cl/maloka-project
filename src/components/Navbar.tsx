'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, CalendarCheck, Shield, ArrowRight } from 'lucide-react'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/wisata', label: 'Destinasi Wisata' },
  { href: '/wisata?kategori=alam', label: 'Wisata Alam' },
  { href: '/wisata?kategori=budaya-sejarah', label: 'Budaya & Candi' },
  { href: '/cek-pesanan', label: 'Cek Pesanan', icon: CalendarCheck },
]

export default function Navbar() {
  const pathname = usePathname()

  // Halaman yang memiliki latar hero gelap di bagian atas (Beranda & Destinasi Wisata)
  const isHeroPage = pathname === '/' || pathname.startsWith('/wisata')

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current)
    }
  }, [])

  const handleEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setHovered(true)
  }
  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => setHovered(false), 250)
  }

  // Navbar penuh tampil: jika bukan halaman hero, atau di-scroll / kursor di atasnya / menu mobile terbuka
  const visible = !isHeroPage || scrolled || hovered || mobileMenuOpen

  // Di atas foto hero (sebelum scroll): teks putih
  const onDark = isHeroPage && !scrolled && !mobileMenuOpen

  const reveal = visible
    ? 'opacity-100 translate-y-0 blur-0'
    : 'opacity-0 -translate-y-3 blur-[2px] pointer-events-none'

  const isActive = (href: string) => !href.includes('?') && pathname === href

  // Warna teks menyesuaikan latar
  const linkBase = onDark
    ? 'text-white/90 hover:text-white drop-shadow-sm'
    : 'text-teks-isi hover:text-tosca'
  const linkActive = onDark ? 'text-white font-semibold' : 'text-tosca font-semibold'

  // Gaya kaca bening
  const headerStyle = !visible
    ? 'bg-transparent border-b border-transparent shadow-none'
    : onDark
      ? 'bg-black/15 backdrop-blur-md border-b border-white/15 shadow-none'
      : 'bg-white/45 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/40 shadow-[0_8px_30px_-12px_rgba(8,47,73,0.18)]'

  return (
    <>
      <header
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${EASE} motion-reduce:transition-none ${headerStyle}`}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            <Link href="/" className="flex items-center group shrink-0" aria-label="Maloka - Beranda">
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 ${EASE} group-hover:scale-105`}
              >
                <Image
                  src="/MalokaLogo.png"
                  alt="Maloka Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  priority
                />
              </div>
              <div
                className={`flex items-center overflow-hidden whitespace-nowrap transition-all duration-500 ${EASE} ${
                  visible ? 'max-w-65 opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'
                }`}
              >
                <span
                  className={`text-xl font-bold tracking-tight transition-colors ${
                    onDark ? 'text-white drop-shadow-md' : 'text-biru-tua group-hover:text-tosca'
                  }`}
                >
                  MALOKA
                </span>
              </div>
            </Link>

            <nav
              aria-hidden={!visible}
              className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm"
            >
              {NAV_LINKS.map((link, i) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <span
                    key={link.href}
                    className={`transition-[opacity,transform,filter] duration-500 ${EASE} ${reveal}`}
                    style={{ transitionDelay: visible ? `${100 + i * 55}ms` : '0ms' }}
                  >
                    <Link
                      href={link.href}
                      tabIndex={visible ? 0 : -1}
                      className={`relative inline-flex items-center gap-1.5 px-1 py-1 transition-colors rounded-md focus-visible:outline-hidden focus-visible:ring-2 ring-tosca
                        after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:origin-center after:transition-transform after:duration-300 ${
                        onDark ? 'after:bg-white' : 'after:bg-tosca'
                      } ${
                        active
                          ? `${linkActive} after:scale-x-100`
                          : `${linkBase} font-medium after:scale-x-0 hover:after:scale-x-100`
                      }`}
                    >
                      {Icon && <Icon className={`w-4 h-4 ${onDark ? 'text-white' : 'text-tosca'}`} />}
                      <span>{link.label}</span>
                    </Link>
                  </span>
                )
              })}
            </nav>

            {/* Action Buttons (Right) */}
            <div aria-hidden={!visible} className="hidden md:flex items-center space-x-3">
              <span
                className={`transition-[opacity,transform,filter] duration-500 ${EASE} ${reveal}`}
                style={{ transitionDelay: visible ? '380ms' : '0ms' }}
              >
                <Link
                  href="/pesan"
                  tabIndex={visible ? 0 : -1}
                  className="group/btn inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full text-white
                    bg-linear-to-r from-tosca to-biru-tua shadow-md hover:shadow-lg hover:shadow-tosca/30
                    transition-all duration-300 hover:scale-[1.04] active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 ring-tosca"
                >
                  <span>Pesan Wisata</span>
                  <ArrowRight className="h-4 w-0 -ml-1 opacity-0 group-hover/btn:w-4 group-hover/btn:ml-0 group-hover/btn:opacity-100 transition-all duration-300" />
                </Link>
              </span>

              <span
                className={`transition-[opacity,transform,filter] duration-500 ${EASE} ${reveal}`}
                style={{ transitionDelay: visible ? '440ms' : '0ms' }}
              >
                <Link
                  href="/admin/login"
                  tabIndex={visible ? 0 : -1}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors focus-visible:outline-hidden focus-visible:ring-2 ring-tosca ${
                    onDark
                      ? 'text-white/85 hover:text-white hover:bg-white/15'
                      : 'text-teks-sekunder hover:text-biru-tua hover:bg-white/60'
                  }`}
                  title="Dashboard Pengelola"
                >
                  <Shield className={`w-3.5 h-3.5 ${onDark ? 'text-white' : 'text-tosca'}`} />
                  <span>Admin</span>
                </Link>
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              className={`md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 ring-tosca transition-colors duration-300 ${
                onDark ? 'text-white drop-shadow-lg' : 'text-biru-tua hover:bg-white/60'
              }`}
            >
              <Menu
                className={`absolute w-6 h-6 transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                className={`absolute w-6 h-6 transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown (kaca bening) */}
        <div
          aria-hidden={!mobileMenuOpen}
          className={`md:hidden grid transition-[grid-template-rows,opacity] duration-500 ${EASE} ${
            mobileMenuOpen
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-white/40 bg-white/60 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1 shadow-lg">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/wisata', label: 'Destinasi Wisata' },
                { href: '/cek-pesanan', label: 'Cek Status Pesanan' },
              ].map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  style={{ transitionDelay: mobileMenuOpen ? `${120 + i * 60}ms` : '0ms' }}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm transition-all duration-500 ${EASE} focus-visible:outline-hidden focus-visible:ring-2 ring-tosca ${
                    mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                  } ${
                    isActive(link.href)
                      ? 'text-tosca bg-white/60 font-semibold'
                      : 'text-teks-isi hover:text-tosca hover:bg-white/50 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div
                style={{ transitionDelay: mobileMenuOpen ? '320ms' : '0ms' }}
                className={`pt-3 mt-2 border-t border-white/50 flex flex-col gap-2 transition-all duration-500 ${EASE} ${
                  mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                }`}
              >
                <Link
                  href="/pesan"
                  onClick={() => setMobileMenuOpen(false)}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  className="w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-linear-to-r from-tosca to-biru-tua shadow-xs active:scale-95 transition-transform focus-visible:outline-hidden focus-visible:ring-2 ring-tosca"
                >
                  Pesan Wisata Sekarang
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  className="w-full text-center px-4 py-2 rounded-lg text-xs font-medium text-teks-sekunder hover:text-biru-tua hover:bg-white/50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 ring-tosca"
                >
                  Login Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer: di halaman selain beranda & destinasi wisata, dorong konten ke bawah navbar */}
      {!isHeroPage && <div className="h-14 lg:h-16" aria-hidden />}
    </>
  )
}