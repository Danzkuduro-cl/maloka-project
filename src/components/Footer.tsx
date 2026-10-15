import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-biru-tua text-white/80 border-t border-biru-sangat-tua mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Client context (Left column) - Rata kiri */}
          <div className="space-y-4 md:col-span-1 text-left">
            <div className="flex items-center gap-3 justify-start">
              <div className="relative w-36 h-14 sm:w-55 sm:h-20 flex items-center justify-start shrink-0">
                <Image
                  src="/MalokaLogo.png"
                  alt="Maloka Logo"
                  width={160}
                  height={64}
                  className="w-full h-full object-contain object-left filter drop-shadow-sm"
                />
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                MALOKA
              </span>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed text-left">
              Platform informasi wisata terpadu dan travel agent resmi Magelang. Mudahkan rencana
              liburan, tiket masuk, tour guide, hingga transportasi dalam satu pintu.
            </p>
            <div className="pt-2 border-t border-white/10 text-left">
              <span className="text-xs uppercase tracking-wider text-[#7FD6EE] font-semibold block">
                Inisiatif Kerja Sama
              </span>
              <p className="text-xs text-white/70 mt-1">
                PT BMG Capital Technology
                <br />
                Jl. Damai, Sleman, D.I. Yogyakarta
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Kategori Wisata
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/wisata?kategori=budaya-sejarah" className="hover:text-[#7FD6EE] transition-colors">
                  Candi & Sejarah
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=alam" className="hover:text-[#7FD6EE] transition-colors">
                  Wisata Alam & Sunrise
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=kuliner" className="hover:text-[#7FD6EE] transition-colors">
                  Sentra Kuliner Khas
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=edukasi-rekreasi" className="hover:text-[#7FD6EE] transition-colors">
                  Rekreasi & Foto
                </Link>
              </li>
              <li>
                <Link href="/wisata?kategori=religi" className="hover:text-[#7FD6EE] transition-colors">
                  Wisata Religi
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan Travel Agent */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Layanan Maloka
            </h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/pesan" className="hover:text-[#7FD6EE] transition-colors">
                  Pemesanan Tiket Wisata
                </Link>
              </li>
              <li>
                <Link href="/pesan" className="hover:text-[#7FD6EE] transition-colors">
                  Tour Guide Berlisensi HPI
                </Link>
              </li>
              <li>
                <Link href="/pesan" className="hover:text-[#7FD6EE] transition-colors">
                  Sewa Jeep Sunrise Punthuk
                </Link>
              </li>
              <li>
                <Link href="/pesan" className="hover:text-[#7FD6EE] transition-colors">
                  Homestay Balkondes Borobudur
                </Link>
              </li>
              <li>
                <Link href="/cek-pesanan" className="hover:text-[#7FD6EE] transition-colors">
                  Cek & Konfirmasi Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Bantuan */}
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-biru-muda flex items-center justify-center text-tosca shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-tosca" />
                </div>
                <span>Kawasan Pariwisata Borobudur, Kabupaten Magelang, Jawa Tengah</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-biru-muda flex items-center justify-center text-tosca shrink-0">
                  <Phone className="w-4 h-4 text-tosca" />
                </div>
                <span>+62 812-3456-7890 (Customer Care)</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-biru-muda flex items-center justify-center text-tosca shrink-0">
                  <Mail className="w-4 h-4 text-tosca" />
                </div>
                <span>halo@maloka.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-biru-sangat-tua border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} Maloka Magelang. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk Tugas Pemrograman Web Framework — Kelompok 2
          </p>
        </div>
      </div>
    </footer>
  )
}