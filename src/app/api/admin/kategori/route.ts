import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// GET /api/admin/kategori — Ambil semua kategori beserta jumlah destinasi di dalamnya
export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const kategoris = await prisma.kategori.findMany({
      include: {
        _count: {
          select: { destinasis: true },
        },
      },
      orderBy: { id: 'asc' },
    })

    return NextResponse.json({ success: true, data: kategoris })
  } catch (error) {
    console.error('[GET /api/admin/kategori]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data kategori.' },
      { status: 500 }
    )
  }
}

// POST /api/admin/kategori — Tambah kategori wisata baru
export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nama, deskripsi } = body

    if (!nama || !String(nama).trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama kategori wajib diisi.' },
        { status: 400 }
      )
    }

    const cleanNama = String(nama).trim()
    const baseSlug = cleanNama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    // Cek duplikasi nama atau slug
    const existing = await prisma.kategori.findFirst({
      where: {
        OR: [{ nama: { equals: cleanNama, mode: 'insensitive' } }, { slug: baseSlug }],
      },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Kategori dengan nama tersebut sudah ada.' },
        { status: 400 }
      )
    }

    const kategori = await prisma.kategori.create({
      data: {
        nama: cleanNama,
        slug: baseSlug,
        deskripsi: deskripsi ? String(deskripsi).trim() : null,
      },
      include: {
        _count: {
          select: { destinasis: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: kategori }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/kategori]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan kategori baru.' },
      { status: 500 }
    )
  }
}
