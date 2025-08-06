'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const publicPages = ['/', '/login', '/auth/callback']

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const shouldShow = !publicPages.includes(pathname) && user && !loading
  if (!shouldShow) return null

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent hover:opacity-80"
            >
              🐠 TankWiki
            </button>
          </div>
          <div className="hidden md:flex space-x-6">
            <button onClick={() => router.push('/dashboard')} className="nav-link">Dashboard</button>
            <button onClick={() => router.push('/aquariums')} className="nav-link">Aquariums</button>
            <button onClick={() => router.push('/tanks')} className="nav-link">Tanks</button>
          </div>
          <div className="flex space-x-4 items-center">
            <span className="text-gray-400 text-sm hidden md:block">{user?.email}</span>
            <button onClick={handleLogout} className="bg-orange-600 hover:bg-green-400 hover:text-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
