'use client'

import { Inter } from 'next/font/google'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Pages that don't need the navbar
  const publicPages = ['/login', '/auth/callback', '/']

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const showNavbar = !publicPages.includes(pathname) && user && !loading

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        {showNavbar && (
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
                  <button
                    onClick={() => router.push('/dashboard')}
                    className={`text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-teal-400 bg-gray-800' : ''}`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/aquariums')}
                    className={`text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith('/aquariums') ? 'text-teal-400 bg-gray-800' : ''}`}
                  >
                    Aquariums
                  </button>
                  <button
                    onClick={() => router.push('/tanks')}
                    className={`text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith('/tanks') ? 'text-teal-400 bg-gray-800' : ''}`}
                  >
                    Tanks
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">
                      {user?.email}
                    </span>
                    <div className="w-px h-6 bg-gray-600"></div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-orange-600 hover:bg-green-400 hover:text-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="md:hidden border-t border-gray-800">
              <div className="px-4 py-3 space-y-1">
                <button
                  onClick={() => router.push('/dashboard')}
                  className={`block w-full text-left text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-teal-400 bg-gray-800' : ''}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/aquariums')}
                  className={`block w-full text-left text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith('/aquariums') ? 'text-teal-400 bg-gray-800' : ''}`}
                >
                  Aquariums
                </button>
                <button
                  onClick={() => router.push('/tanks')}
                  className={`block w-full text-left text-gray-300 hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.startsWith('/tanks') ? 'text-teal-400 bg-gray-800' : ''}`}
                >
                  Tanks
                </button>
                <div className="pt-2 border-t border-gray-700 mt-2">
                  <div className="text-gray-400 text-xs px-3 py-1">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main className={showNavbar ? '' : 'min-h-screen'}>
          {children}
        </main>

        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-green-400/3 rounded-full blur-2xl"></div>
        </div>
      </body>
    </html>
  )
}
