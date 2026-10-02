import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/destinasi/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const destinasiId = parseInt(id)

    if (isNaN(destinasiId)) {
      return NextResponse.json(
        { success: false, message: 'ID destinasi tidak valid.' },
        { status: 400 }
      )
    }

    const destinasi = await prisma.destinasi.findUnique({
      where: { id: destinasiId },
      include: {
        kategori: true,
        layanans: {
          orderBy: [{ tipe: 'asc' }, { harga: 'asc' }],
        },
      },
    })

    if (!destinasi) {
      return NextResponse.json(
        { success: false, message: 'Destinasi tidak ditemukan.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: destinasi })
  } catch (error) {
    console.error('[GET /api/destinasi/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail destinasi.' },
      { status: 500 }
    )
  }
}
