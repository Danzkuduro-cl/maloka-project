import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/lib/session'
import AdminSidebarNav from '@/components/AdminSidebarNav'
import { Compass, ExternalLink } from 'lucide-react'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col justify-between shrink-0 border-r border-gray-800">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-wider block">MALOKA</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block -mt-1 tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <AdminSidebarNav />
        </div>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/50">
          <div className="mb-3 px-2">
            <span className="text-xs font-bold text-white block truncate">{session.nama}</span>
            <span className="text-[11px] text-gray-400 block truncate">{session.email}</span>
          </div>

          <div className="pt-2 border-t border-gray-800 flex flex-col gap-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full">
        {children}
      </main>
    </div>
  )
}
