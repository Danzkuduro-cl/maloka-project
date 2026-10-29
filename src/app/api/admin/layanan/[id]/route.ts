import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'
import { TipeLayanan } from '@/generated/prisma/client'

const VALID_TIPE: TipeLayanan[] = ['TIKET', 'TOUR_GUIDE', 'PENGINAPAN', 'TRANSPORTASI']

// PUT /api/admin/layanan/[id] — Edit data layanan
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
    const layananId = parseInt(id)
    if (isNaN(layananId)) {
      return NextResponse.json({ success: false, message: 'ID layanan tidak valid.' }, { status: 400 })
    }

    const body = await request.json()
    const { nama, tipe, harga, deskripsi, destinasiId } = body

    if (tipe && !VALID_TIPE.includes(tipe)) {
      return NextResponse.json(
        { success: false, message: 'Tipe layanan tidak valid.' },
        { status: 400 }
      )
    }

    const layanan = await prisma.layanan.update({
      where: { id: layananId },
      data: {
        ...(nama ? { nama: String(nama).trim() } : {}),
        ...(tipe ? { tipe: tipe as TipeLayanan } : {}),
        ...(harga !== undefined ? { harga: parseFloat(String(harga)) || 0 } : {}),
        ...(deskripsi !== undefined ? { deskripsi: deskripsi ? String(deskripsi).trim() : null } : {}),
        ...(destinasiId !== undefined
          ? { destinasiId: destinasiId ? parseInt(String(destinasiId)) : null }
          : {}),
      },
      include: {
        destinasi: {
          select: { id: true, nama: true, lokasi: true },
        },
        _count: {
          select: { detailPesanans: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: layanan })
  } catch (error) {
    console.error('[PUT /api/admin/layanan/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui layanan.' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/layanan/[id] — Hapus layanan (dengan proteksi riwayat pesanan)
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
    const layananId = parseInt(id)
    if (isNaN(layananId)) {
      return NextResponse.json({ success: false, message: 'ID layanan tidak valid.' }, { status: 400 })
    }

    // Cek apakah layanan ini sudah pernah dipesan di DetailPesanan
    const usedCount = await prisma.detailPesanan.count({
      where: { layananId },
    })

    if (usedCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Layanan ini tidak dapat dihapus karena sudah tercatat pada ${usedCount} rincian pesanan wisatawan.`,
        },
        { status: 400 }
      )
    }

    await prisma.layanan.delete({
      where: { id: layananId },
    })

    return NextResponse.json({ success: true, message: 'Layanan berhasil dihapus.' })
  } catch (error) {
    console.error('[DELETE /api/admin/layanan/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus layanan.' },
      { status: 500 }
    )
  }
}
