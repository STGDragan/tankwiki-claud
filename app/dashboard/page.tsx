'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'

interface Aquarium {
  id: string
  name: string
  location?: string
  created_at: string
  tank_count?: number
}

interface Tank {
  id: string
  name: string
  volume: number
  tank_type: string
  aquarium_id: string
  aquarium?: {
    name: string
  }
}

interface Livestock {
  id: string
  species: string
  common_name?: string
  quantity: number
  health_status: string
  tank?: {
    name: string
  }
}

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [aquariums, setAquariums] = useState<Aquarium[]>([])
  const [tanks, setTanks] = useState<Tank[]>([])
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        router.replace('/login')
        return
      }
      
      if (!session) {
        router.replace('/login')
        return
      }
      
      setSession(session)
      setUser(session.user)
      setLoading(false)
      
      // Fetch dashboard data after confirming session
      await fetchDashboardData(session.user.id)
      
    } catch (err) {
      console.error('Auth check error:', err)
      router.replace('/login')
    }
  }

  const fetchDashboardData = async (userId: string) => {
    try {
      setDataLoading(true)
      
      // Fetch aquariums with tank counts
      const { data: aquariumData, error: aquariumError } = await supabase
        .from('aquariums')
        .select(`
          id,
          name,
          location,
          created_at,
          tanks(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (aquariumError) {
        setError('Failed to fetch aquariums: ' + aquariumError.message)
      } else {
        const processedAquariums = aquariumData?.map(aq => ({
          ...aq,
          tank_count: aq.tanks?.[0]?.count || 0
        })) || []
        setAquariums(processedAquariums)
      }

      // Fetch tanks with aquarium names
      const { data: tankData, error: tankError } = await supabase
        .from('tanks')
        .select(`
          id,
          name,
          volume,
          tank_type,
          aquarium_id,
          aquariums(name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (tankError) {
        setError('Failed to fetch tanks: ' + tankError.message)
      } else {
        const processedTanks = tankData?.map(tank => ({
          ...tank,
          aquarium: tank.aquariums
        })) || []
        setTanks(processedTanks)
      }

      // Fetch recent livestock
      const { data: livestockData, error: livestockError } = await supabase
        .from('livestock')
        .select(`
          id,
          species,
          common_name,
          quantity,
          health_status,
          tanks(name)
        `)
        .eq('user_id', userId)
        .order('date_added', { ascending: false })
        .limit(10)

      if (livestockError) {
        setError('Failed to fetch livestock: ' + livestockError.message)
      } else {
        const processedLivestock = livestockData?.map(live => ({
          ...live,
          tank: live.tanks
        })) || []
        setLivestock(processedLivestock)
      }

    } catch (err) {
      console.error('Data fetch error:', err)
      setError('An unexpected error occurred while loading data')
    } finally {
      setDataLoading(false)
    }
  }

  const formatTankType = (tankType: string) => {
    return tankType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'text-green-400 bg-green-900/30'
      case 'sick':
        return 'text-yellow-400 bg-yellow-900/30'
      case 'dead':
        return 'text-red-400 bg-red-900/30'
      default:
        return 'text-gray-400 bg-gray-900/30'
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Checking authentication...</h2>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">TankWiki Dashboard</h1>
              <p className="text-gray-400 mt-1">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/aquariums/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                New Aquarium
              </button>
              <button
                onClick={() => router.push('/tanks/new')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                New Tank
              </button>
              <button
                onClick={handleSignOut}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {dataLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Aquariums */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">Aquariums</h2>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {aquariums.length}
                </span>
              </div>
              
              {aquariums.length > 0 ? (
                <div className="space-y-3">
                  {aquariums.map((aquarium) => (
                    <div
                      key={aquarium.id}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => router.push(`/aquariums/${aquarium.id}`)}
                    >
                      <h3 className="font-medium text-white">{aquarium.name}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        {aquarium.location && <p>📍 {aquarium.location}</p>}
                        <p>{aquarium.tank_count} tanks</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No aquariums yet</p>
                  <button
                    onClick={() => router.push('/aquariums/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Create Your First Aquarium
                  </button>
                </div>
              )}
            </div>

            {/* Recent Tanks */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">Recent Tanks</h2>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                  {tanks.length}
                </span>
              </div>
              
              {tanks.length > 0 ? (
                <div className="space-y-3">
                  {tanks.map((tank) => (
                    <div
                      key={tank.id}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => router.push(`/tanks/${tank.id}`)}
                    >
                      <h3 className="font-medium text-white">{tank.name}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>{tank.volume} gallons • {formatTankType(tank.tank_type)}</p>
                        <p>in {tank.aquarium?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No tanks yet</p>
                  <button
                    onClick={() => router.push('/tanks/new')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add Your First Tank
                  </button>
                </div>
              )}
            </div>

            {/* Recent Livestock */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">Recent Livestock</h2>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                  {livestock.length}
                </span>
              </div>
              
              {livestock.length > 0 ? (
                <div className="space-y-3">
                  {livestock.map((animal) => (
                    <div key={animal.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">
                          {animal.common_name || animal.species}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                            {animal.quantity}x
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(animal.health_status)}`}>
                            {animal.health_status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>in {animal.tank?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No livestock yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}