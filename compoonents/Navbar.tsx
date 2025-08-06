'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon, HomeIcon, BeakerIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import ColorModeToggle from './ColorModeToggle'
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

  const publicRoutes = ['/login', '/signup', '/auth', '/']

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="spinner"></div>
          </div>
        </div>
      </nav>
    )
  }

  if (isPublicRoute && !user) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center glow group-hover:animate-pulse">
                  <span className="text-xl">🐠</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 glow-text animate-pulse"></div>
              </div>
              <span className="font-orbitron text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                TankWiki
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <ColorModeToggle />
              <Link
                href="/login"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 glow-button"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (!user) return null

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center glow group-hover:animate-pulse">
                <span className="text-xl">🐠</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 glow-text animate-pulse"></div>
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
                  ? 'bg-orange-500/20 text-orange-400 glow'
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
                  ? 'bg-red-500/20 text-red-400 glow'
                  : 'text-gray-300 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <BeakerIcon className="h-5 w-5" />
              <span>Aquariums</span>
            </Link>

            <Link
              href="/tanks"
              className={`flex items-center space-