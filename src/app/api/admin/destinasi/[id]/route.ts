import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// PUT /api/admin/destinasi/[id] — Update data destinasi
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
    const destinasiId = parseInt(id)
    if (isNaN(destinasiId)) {
      return NextResponse.json({ success: false, message: 'ID tidak valid' }, { status: 400 })
    }

    const body = await request.json()
    const { nama, deskripsi, hargaTiket, jamBuka, jamTutup, lokasi, alamat, fotoUrl, isPopuler, kategoriId } =
      body

    const destinasi = await prisma.destinasi.update({
      where: { id: destinasiId },
      data: {
        ...(nama ? { nama } : {}),
        ...(deskripsi ? { deskripsi } : {}),
        ...(hargaTiket !== undefined ? { hargaTiket: parseFloat(hargaTiket) } : {}),
        ...(jamBuka ? { jamBuka } : {}),
        ...(jamTutup ? { jamTutup } : {}),
        ...(lokasi ? { lokasi } : {}),
        ...(alamat !== undefined ? { alamat } : {}),
        ...(fotoUrl !== undefined ? { fotoUrl } : {}),
        ...(isPopuler !== undefined ? { isPopuler: Boolean(isPopuler) } : {}),
        ...(kategoriId ? { kategoriId: parseInt(kategoriId) } : {}),
      },
    })

    return NextResponse.json({ success: true, data: destinasi })
  } catch (error) {
    console.error('[PUT /api/admin/destinasi/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui destinasi.' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/destinasi/[id] — Hapus destinasi
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
    const destinasiId = parseInt(id)
    if (isNaN(destinasiId)) {
      return NextResponse.json({ success: false, message: 'ID tidak valid' }, { status: 400 })
    }

    await prisma.destinasi.delete({
      where: { id: destinasiId },
    })

    return NextResponse.json({ success: true, message: 'Destinasi berhasil dihapus.' })
  } catch (error) {
    console.error('[DELETE /api/admin/destinasi/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus destinasi.' },
      { status: 500 }
    )
  }
}
