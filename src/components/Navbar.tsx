'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Compass, Menu, X, CalendarCheck, Shield } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900 group-hover:text-emerald-700 transition-colors">
                MALOKA
              </span>
              <span className="hidden sm:inline-block ml-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Magelang
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Beranda
            </Link>
            <Link href="/wisata" className="hover:text-emerald-600 transition-colors">
              Destinasi Wisata
            </Link>
            <Link href="/wisata?kategori=alam" className="hover:text-emerald-600 transition-colors">
              Wisata Alam
            </Link>
            <Link href="/wisata?kategori=budaya-sejarah" className="hover:text-emerald-600 transition-colors">
              Budaya & Candi
            </Link>
            <Link
              href="/cek-pesanan"
              className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              Cek Pesanan
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/pesan"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md"
            >
              Pesan Wisata
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Dashboard Pengelola"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Beranda
          </Link>
          <Link
            href="/wisata"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Destinasi Wisata
          </Link>
          <Link
            href="/cek-pesanan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Cek Status Pesanan
          </Link>
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/pesan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              Pesan Wisata Sekarang
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100"
            >
              Login Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
