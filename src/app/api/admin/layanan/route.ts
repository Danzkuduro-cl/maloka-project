import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { TipeLayanan } from '@/generated/prisma/client'

const VALID_TIPE: TipeLayanan[] = ['TIKET', 'TOUR_GUIDE', 'PENGINAPAN', 'TRANSPORTASI']

// GET /api/admin/layanan — Ambil semua layanan beserta destinasi terkait & jumlah pesanan
export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const layanans = await prisma.layanan.findMany({
      include: {
        destinasi: {
          select: { id: true, nama: true, lokasi: true },
        },
        _count: {
          select: { detailPesanans: true },
        },
      },
      orderBy: [{ tipe: 'asc' }, { id: 'desc' }],
    })

    return NextResponse.json({ success: true, data: layanans })
  } catch (error) {
    console.error('[GET /api/admin/layanan]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data layanan.' },
      { status: 500 }
    )
  }
}

// POST /api/admin/layanan — Tambah layanan baru
export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nama, tipe, harga, deskripsi, destinasiId } = body

    if (!nama || !tipe || harga === undefined || harga === '') {
      return NextResponse.json(
        { success: false, message: 'Nama layanan, tipe, dan harga wajib diisi.' },
        { status: 400 }
      )
    }

    if (!VALID_TIPE.includes(tipe)) {
      return NextResponse.json(
        { success: false, message: 'Tipe layanan tidak valid.' },
        { status: 400 }
      )
    }

    const layanan = await prisma.layanan.create({
      data: {
        nama: String(nama).trim(),
        tipe: tipe as TipeLayanan,
        harga: parseFloat(String(harga)) || 0,
        deskripsi: deskripsi ? String(deskripsi).trim() : null,
        destinasiId: destinasiId ? parseInt(String(destinasiId)) : null,
      },
      include: {
        destinasi: {
          select: { id: true, nama: true, lokasi: true },
        },
        _count: {
          select: { detailPesanans: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: layanan }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/layanan]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan layanan baru.' },
      { status: 500 }
    )
  }
}
