import type { Metadata } from 'next'
import { Manrope, Kaushan_Script, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const manrope = Manrope({
  variable: '--font-sans',
  subsets: ['latin'],
})

const kaushanScript = Kaushan_Script({
  weight: '400',
  variable: '--font-script',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Maloka — Informasi Wisata & Travel Agent Magelang',
  description:
    'Platform terpadu informasi destinasi wisata Magelang, estimasi budget perjalanan, serta pemesanan tiket, tour guide, penginapan, dan transportasi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} ${kaushanScript.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-teks-isi font-sans selection:bg-tosca selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
