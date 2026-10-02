import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/pesanan/[id] — Cek status pesanan by kode pesanan (misal: MLK-20261002-001)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // id bisa berupa kode pesanan (MLK-...) atau numeric ID
    const isNumeric = /^\d+$/.test(id)

    const pesanan = await prisma.pesanan.findFirst({
      where: isNumeric
        ? { id: parseInt(id) }
        : { kodePesanan: id.toUpperCase() },
      include: {
        detailPesanans: {
          include: {
            layanan: {
              select: {
                id: true,
                nama: true,
                tipe: true,
                harga: true,
                destinasi: {
                  select: { id: true, nama: true },
                },
              },
            },
          },
        },
      },
    })

    if (!pesanan) {
      return NextResponse.json(
        { success: false, message: 'Pesanan tidak ditemukan. Periksa kembali kode pesanan Anda.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: pesanan })
  } catch (error) {
    console.error('[GET /api/pesanan/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pesanan.' },
      { status: 500 }
    )
  }
}
