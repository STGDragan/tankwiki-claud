'use client'

import { useRouter, usePathname } from 'next/navigation'

interface NavbarProps {
  user: any
  onLogout: () => void
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
                🐠 TankWiki
              </div>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {['/dashboard', '/aquariums', '/tanks'].map((path) => (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === path || pathname.startsWith(path) ? 'text-teal-400 bg-gray-800' : ''
                }`}
              >
                {path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-gray-400 text-sm">
              {user?.email}
            </span>
            <button
              onClick={onLogout}
              className="bg-orange-600 hover:bg-green-400 hover:text-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
