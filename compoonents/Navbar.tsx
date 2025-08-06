'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  BeakerIcon, 
  ChartBarIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabaseClient'

interface User {
  id: string
  email?: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Routes where navbar should be hidden
  const publicRoutes = ['/login', '/signup', '/auth/callback', '/']

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
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

  // Don't show navbar on public routes or when no user (unless loading)
  const shouldShowNavbar = !publicRoutes.includes(pathname) && (user || loading)

  // Show loading state
  if (loading && shouldShowNavbar) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
              <div className="ml-3 w-24 h-6 bg-gray-600 rounded animate-pulse"></div>
            </div>
            <div className="w-20 h-8 bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  // Don't render if conditions aren't met
  if (!shouldShowNavbar) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center glow group-hover:animate-pulse transition-all duration-300">
                <span className="text-xl">🐠</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
            </div>
            <span className="font-orbitron text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              TankWiki
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                pathname === '/dashboard'
                  ? 'bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20'
                  : 'text-gray-300 hover:text-orange-400 hover:bg-orange-500/10'
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/aquariums"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                pathname.startsWith('/aquariums')
                  ? 'bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20'
                  : 'text-gray-300 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <BeakerIcon className="h-5 w-5" />
              <span>Aquariums</span>
            </Link>

            <Link
              href="/tanks"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                pathname.startsWith('/tanks')
                  ? 'bg-green-400/20 text-green-400 shadow-lg shadow-green-400/20'
                  : 'text-gray-300 hover:text-green-400 hover:bg-green-400/10'
              }`}
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Tanks</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User info */}
            {user?.email && (
              <div className="text-sm text-gray-400 px-3 py-1 bg-gray-800/50 rounded-full">
                {user.email}
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-800/80 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 group border border-gray-600 hover:border-red-500"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-300"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  pathname === '/dashboard'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-300 hover:text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <HomeIcon className="h-6 w-6" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/aquariums"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  pathname.startsWith('/aquariums')
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-gray-300 hover:text-red-400 hover:bg-red-500/10'
                }`}
              >
                <BeakerIcon className="h-6 w-6" />
                <span>Aquariums</span>
              </Link>

              <Link
                href="/tanks"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  pathname.startsWith('/tanks')
                    ? 'bg-green-400/20 text-green-400'
                    : 'text-gray-300 hover:text-green-400 hover:bg-green-400/10'
                }`}
              >
                <ChartBarIcon className="h-6 w-6" />
                <span>Tanks</span>
              </Link>

              {/* Mobile user section */}
              <div className="px-4 py-3 border-t border-gray-700 mt-4">
                {user?.email && (
                  <div className="text-sm text-gray-400 mb-3">
                    Signed in as: {user.email}
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}