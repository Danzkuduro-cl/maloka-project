import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// GET /api/admin/pesanan — Ambil semua data pesanan untuk panel admin
export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status && ['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)
      ? { status: status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' }
      : {}

    const pesanans = await prisma.pesanan.findMany({
      where,
      include: {
        detailPesanans: {
          include: {
            layanan: {
              select: { nama: true, tipe: true, harga: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: pesanans })
  } catch (error) {
    console.error('[GET /api/admin/pesanan]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pesanan.' },
      { status: 500 }
    )
  }
}
