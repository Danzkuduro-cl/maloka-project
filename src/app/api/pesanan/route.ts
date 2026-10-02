import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/pesanan — Buat pesanan baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      namaPemesan,
      email,
      telepon,
      tanggalKunjungan,
      jumlahOrang,
      catatan,
      layananIds, // array of { layananId: number, jumlah: number }
    } = body

    // Validasi field wajib
    if (!namaPemesan || !email || !telepon || !tanggalKunjungan || !jumlahOrang || !layananIds?.length) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data tidak lengkap. Pastikan semua field wajib diisi dan minimal ada 1 layanan dipilih.',
        },
        { status: 400 }
      )
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Format email tidak valid.' },
        { status: 400 }
      )
    }

    // Ambil harga dari DB untuk setiap layanan yang dipilih
    const layananList = await prisma.layanan.findMany({
      where: {
        id: { in: layananIds.map((l: { layananId: number }) => l.layananId) },
      },
    })

    if (layananList.length !== layananIds.length) {
      return NextResponse.json(
        { success: false, message: 'Satu atau lebih layanan yang dipilih tidak ditemukan.' },
        { status: 404 }
      )
    }

    // Hitung total harga
    let totalHarga = 0
    const detailItems = layananIds.map((item: { layananId: number; jumlah: number }) => {
      const layanan = layananList.find((l) => l.id === item.layananId)!
      const subtotal = Number(layanan.harga) * item.jumlah
      totalHarga += subtotal
      return {
        layananId: item.layananId,
        jumlah: item.jumlah,
        subtotal,
      }
    })

    // Buat kode pesanan unik: MLK-YYYYMMDD-XXX
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const existing = await prisma.pesanan.count({
      where: {
        kodePesanan: { startsWith: `MLK-${dateStr}-` },
      },
    })
    const seq = String(existing + 1).padStart(3, '0')
    const kodePesanan = `MLK-${dateStr}-${seq}`

    // Simpan ke database
    const pesanan = await prisma.pesanan.create({
      data: {
        kodePesanan,
        namaPemesan,
        email,
        telepon,
        tanggalKunjungan: new Date(tanggalKunjungan),
        jumlahOrang: parseInt(jumlahOrang),
        totalHarga,
        catatan: catatan || null,
        detailPesanans: {
          create: detailItems,
        },
      },
      include: {
        detailPesanans: {
          include: {
            layanan: { select: { nama: true, tipe: true, harga: true } },
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: `Pesanan berhasil dibuat dengan kode ${kodePesanan}. Tim kami akan menghubungi Anda segera.`,
        data: pesanan,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/pesanan]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memproses pesanan.' },
      { status: 500 }
    )
  }
}
