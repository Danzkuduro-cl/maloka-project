import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password wajib diisi.' },
        { status: 400 }
      )
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah.' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, admin.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah.' },
        { status: 401 }
      )
    }

    // Set secure cookie
    const cookieStore = await cookies()
    cookieStore.set(
      'admin_session',
      JSON.stringify({
        id: admin.id,
        email: admin.email,
        nama: admin.nama,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 hari
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      data: {
        id: admin.id,
        email: admin.email,
        nama: admin.nama,
      },
    })
  } catch (error) {
    console.error('[POST /api/admin/login]', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server saat login.' },
      { status: 500 }
    )
  }
}
