'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, MapPin, ClipboardList, LogOut } from 'lucide-react'

export default function AdminSidebarNav() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    {
      name: 'Ringkasan',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Kelola Destinasi',
      href: '/admin/dashboard/destinasi',
      icon: MapPin,
      exact: false,
    },
    {
      name: 'Kelola Pesanan',
      href: '/admin/dashboard/pesanan',
      icon: ClipboardList,
      exact: false,
    },
  ]

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari admin panel?')) {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <nav className="p-4 space-y-1.5">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href)

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{link.name}</span>
          </Link>
        )
      })}

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-6"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        <span>Keluar (Logout)</span>
      </button>
    </nav>
  )
}
