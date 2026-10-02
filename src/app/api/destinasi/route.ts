import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/destinasi?search=borobudur&kategori=1&populer=true
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const kategoriId = searchParams.get('kategori')
    const populerOnly = searchParams.get('populer') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where = {
      ...(search
        ? {
            OR: [
              { nama: { contains: search, mode: 'insensitive' as const } },
              { lokasi: { contains: search, mode: 'insensitive' as const } },
              { deskripsi: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(kategoriId ? { kategoriId: parseInt(kategoriId) } : {}),
      ...(populerOnly ? { isPopuler: true } : {}),
    }

    const [destinasis, total] = await Promise.all([
      prisma.destinasi.findMany({
        where,
        include: {
          kategori: {
            select: { id: true, nama: true, slug: true },
          },
        },
        orderBy: [{ isPopuler: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.destinasi.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: destinasis,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[GET /api/destinasi]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data destinasi.' },
      { status: 500 }
    )
  }
}
