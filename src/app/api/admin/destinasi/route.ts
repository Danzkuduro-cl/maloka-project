import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// GET /api/admin/destinasi — Ambil semua destinasi untuk panel admin
export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const destinasis = await prisma.destinasi.findMany({
      include: {
        kategori: true,
        _count: { select: { layanans: true } },
      },
      orderBy: { id: 'desc' },
    })

    return NextResponse.json({ success: true, data: destinasis })
  } catch (error) {
    console.error('[GET /api/admin/destinasi]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data destinasi.' },
      { status: 500 }
    )
  }
}

// POST /api/admin/destinasi — Tambah destinasi baru
export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nama, deskripsi, hargaTiket, jamBuka, jamTutup, lokasi, alamat, fotoUrl, isPopuler, kategoriId } =
      body

    if (!nama || !deskripsi || !hargaTiket || !jamBuka || !jamTutup || !lokasi || !kategoriId) {
      return NextResponse.json(
        { success: false, message: 'Mohon isi semua field wajib.' },
        { status: 400 }
      )
    }

    // Buat slug otomatis dari nama
    const baseSlug = nama
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const existingSlug = await prisma.destinasi.findUnique({ where: { slug: baseSlug } })
    const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug

    const destinasi = await prisma.destinasi.create({
      data: {
        nama,
        slug,
        deskripsi,
        hargaTiket: parseFloat(hargaTiket),
        jamBuka,
        jamTutup,
        lokasi,
        alamat: alamat || null,
        fotoUrl: fotoUrl || null,
        isPopuler: Boolean(isPopuler),
        kategoriId: parseInt(kategoriId),
      },
    })

    return NextResponse.json({ success: true, data: destinasi }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/destinasi]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan destinasi.' },
      { status: 500 }
    )
  }
}
