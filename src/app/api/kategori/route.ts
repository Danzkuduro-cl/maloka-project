import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const kategori = await prisma.kategori.findMany({
      orderBy: { nama: 'asc' },
      include: {
        _count: {
          select: { destinasis: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: kategori,
    })
  } catch (error) {
    console.error('[GET /api/kategori]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data kategori.' },
      { status: 500 }
    )
  }
}
