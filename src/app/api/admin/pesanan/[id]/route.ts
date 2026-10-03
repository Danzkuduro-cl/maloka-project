import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

// PUT /api/admin/pesanan/[id] — Update status pesanan
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
    const pesananId = parseInt(id)
    if (isNaN(pesananId)) {
      return NextResponse.json({ success: false, message: 'ID tidak valid' }, { status: 400 })
    }

    const { status } = await request.json()
    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Status tidak valid' }, { status: 400 })
    }

    const pesanan = await prisma.pesanan.update({
      where: { id: pesananId },
      data: { status },
    })

    return NextResponse.json({
      success: true,
      message: `Status pesanan berhasil diubah menjadi ${status}`,
      data: pesanan,
    })
  } catch (error) {
    console.error('[PUT /api/admin/pesanan/[id]]', error)
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status pesanan.' },
      { status: 500 }
    )
  }
}
