import Link from 'next/link'
import { Compass, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Client context */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">MALOKA</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform informasi wisata terpadu dan travel agent resmi Magelang. Mudahkan rencana
              liburan, tiket masuk, tour guide, hingga transportasi dalam satu pintu.
            </p>
            <div className="pt-2 border-t border-gray-800">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
                Inisiatif Kerja Sama
              </span>
              <p className="text-xs text-gray-400 mt-1">
                PT BMG Capital Technology
                <br />
                Jl. Damai, Sleman, D.I. Yogyakarta
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Kategori Wisata
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/wisata?kategori=budaya-sejarah" className="hover:text-emerald-400 transition-colors">
                  Candi & Sejarah
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=alam" className="hover:text-emerald-400 transition-colors">
                  Wisata Alam & Sunrise
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=kuliner" className="hover:text-emerald-400 transition-colors">
                  Sentra Kuliner Khas
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=edukasi-rekreasi" className="hover:text-emerald-400 transition-colors">
                  Rekreasi & Foto
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=religi" className="hover:text-emerald-400 transition-colors">
                  Wisata Religi
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan Travel Agent */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Layanan Maloka
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/pesan" className="hover:text-emerald-400 transition-colors">
                  Pemesanan Tiket Wisata
                </Link>
              </li>
              <li>
                <Link href="/pesan" className="hover:text-emerald-400 transition-colors">
                  Tour Guide Berlisensi HPI
                </Link>
              </li>
              <li>
                <Link href="/pesan" className="hover:text-emerald-400 transition-colors">
                  Sewa Jeep Sunrise Punthuk
                </Link>
              </li>
              <li>
                <Link href="/pesan" className="hover:text-emerald-400 transition-colors">
                  Homestay Balkondes Borobudur
                </Link>
              </li>
              <li>
                <Link href="/cek-pesanan" className="hover:text-emerald-400 transition-colors">
                  Cek & Konfirmasi Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Bantuan */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kawasan Pariwisata Borobudur, Kabupaten Magelang, Jawa Tengah</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 812-3456-7890 (Customer Care)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>halo@maloka.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Maloka Magelang. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1 text-gray-500">
            Dibuat untuk Tugas Pemrograman Web Framework — Kelompok 2
          </p>
        </div>
      </div>
    </footer>
  )
}
