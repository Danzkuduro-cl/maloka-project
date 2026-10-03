import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export interface AdminSession {
  id: number
  email: string
  nama: string
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const sessionVal = cookieStore.get('admin_session')?.value

  if (!sessionVal) return null

  try {
    const parsed = JSON.parse(sessionVal)
    if (!parsed?.id || !parsed?.email) return null

    // Verifikasi admin masih ada di database
    const admin = await prisma.admin.findUnique({
      where: { id: parsed.id, email: parsed.email },
      select: { id: true, email: true, nama: true },
    })

    return admin
  } catch {
    return null
  }
}
