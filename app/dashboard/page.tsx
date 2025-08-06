'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aquariums, setAquariums] = useState([])
  const [tanks, setTanks] = useState([])
  const [livestock, setLivestock] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)

      const { data: aquariumData } = await supabase
        .from('aquariums')
        .select('*')
        .eq('user_id', session?.user.id)

      const { data: tankData } = await supabase
        .from('tanks')
        .select('*')
        .eq('user_id', session?.user.id)

      const { data: livestockData } = await supabase
        .from('livestock')
        .select('*')
        .eq('user_id', session?.user.id)

      setAquariums(aquariumData || [])
      setTanks(tankData || [])
      setLivestock(livestockData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center p-10 text-gray-400">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-white">TankWiki Dashboard</h1>
      <p className="text-gray-400 mb-6">Welcome back, {user?.email}</p>

      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/aquariums/new')}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          New Aquarium
        </button>
        <button
          onClick={() => router.push('/tanks/new')}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          New Tank
        </button>
        <button
          onClick={() => router.push('/login')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-2">Aquariums</h2>
          <p className="text-gray-400 mb-4">{aquariums.length} total</p>
          {aquariums.length === 0 && (
            <button
              onClick={() => router.push('/aquariums/new')}
              className="text-sm text-orange-400 hover:underline"
            >
              Create Your First Aquarium
            </button>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-2">Tanks</h2>
          <p className="text-gray-400 mb-4">{tanks.length} total</p>
          {tanks.length === 0 && (
            <button
              onClick={() => router.push('/tanks/new')}
              className="text-sm text-orange-400 hover:underline"
            >
              Add Your First Tank
            </button>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-2">Livestock</h2>
          <p className="text-gray-400 mb-4">{livestock.length} total</p>
          {livestock.length === 0 && (
            <p className="text-sm text-orange-400">No livestock yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
