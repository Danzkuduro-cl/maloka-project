import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// PUT /api/admin/kategori/[id] — Edit nama & deskripsi kategori
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const kategoriId = parseInt(id)
    if (isNaN(kategoriId)) {
      return NextResponse.json({ success: false, message: 'ID kategori tidak valid.' }, { status: 400 })
    }

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

    // Pastikan tidak bentrok dengan kategori lain
    const duplicate = await prisma.kategori.findFirst({
      where: {
        id: { not: kategoriId },
        OR: [{ nama: { equals: cleanNama, mode: 'insensitive' } }, { slug: baseSlug }],
      },
    })

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: 'Nama kategori tersebut sudah digunakan.' },
        { status: 400 }
      )
    }

    const kategori = await prisma.kategori.update({
      where: { id: kategoriId },
      data: {
        nama: cleanNama,
        slug: baseSlug,
        deskripsi: deskripsi !== undefined ? (deskripsi ? String(deskripsi).trim() : null) : undefined,
      },
      include: {
        _count: {
          select: { destinasis: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: kategori })
  } catch (error) {
    console.error('[PUT /api/admin/kategori/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui kategori.' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/kategori/[id] — Hapus kategori (dengan pengaman agar destinasi tidak ikut terhapus)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const kategoriId = parseInt(id)
    if (isNaN(kategoriId)) {
      return NextResponse.json({ success: false, message: 'ID kategori tidak valid.' }, { status: 400 })
    }

    // Pengaman Cascade: Cek apakah masih ada destinasi di dalam kategori ini
    const destCount = await prisma.destinasi.count({
      where: { kategoriId },
    })

    if (destCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Kategori ini tidak dapat dihapus karena masih digunakan oleh ${destCount} destinasi wisata. Pindahkan atau hapus destinasi terkait terlebih dahulu.`,
        },
        { status: 400 }
      )
    }

    await prisma.kategori.delete({
      where: { id: kategoriId },
    })

    return NextResponse.json({ success: true, message: 'Kategori berhasil dihapus.' })
  } catch (error) {
    console.error('[DELETE /api/admin/kategori/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus kategori.' },
      { status: 500 }
    )
  }
}
