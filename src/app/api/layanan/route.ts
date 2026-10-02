import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/layanan?tipe=TIKET&destinasi=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipe = searchParams.get('tipe')
    const destinasiId = searchParams.get('destinasi')

    const validTipes = ['TIKET', 'TOUR_GUIDE', 'PENGINAPAN', 'TRANSPORTASI']

    const layanan = await prisma.layanan.findMany({
      where: {
        ...(tipe && validTipes.includes(tipe) ? { tipe: tipe as 'TIKET' | 'TOUR_GUIDE' | 'PENGINAPAN' | 'TRANSPORTASI' } : {}),
        ...(destinasiId ? { destinasiId: parseInt(destinasiId) } : {}),
      },
      include: {
        destinasi: {
          select: { id: true, nama: true, slug: true },
        },
      },
      orderBy: [{ tipe: 'asc' }, { harga: 'asc' }],
    })

    return NextResponse.json({ success: true, data: layanan })
  } catch (error) {
    console.error('[GET /api/layanan]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data layanan.' },
      { status: 500 }
    )
  }
}
