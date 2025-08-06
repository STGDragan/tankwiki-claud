'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [tanks, setTanks] = useState([])
  const [livestock, setLivestock] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/login')
        return
      }

      setUser(session.user)

      const { data: userTanks } = await supabase
        .from('tanks')
        .select('*')
        .eq('user_id', session.user.id)

      const { data: userLivestock } = await supabase
        .from('livestock')
        .select('*')
        .eq('user_id', session.user.id)

      setTanks(userTanks || [])
      setLivestock(userLivestock || [])
      setLoading(false)
    }

    fetchData()
  }, [router])

  if (loading) return <div className="text-white p-4">Loading dashboard...</div>

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Tanks</h2>
        {tanks.length > 0 ? (
          <ul className="space-y-2">
            {tanks.map((tank: any) => (
              <li key={tank.id} className="bg-gray-800 p-4 rounded-lg">
                <strong>Name:</strong> {tank.name || 'Unnamed Tank'}<br />
                <strong>Volume:</strong> {tank.volume} {tank.unit || 'gallons'}<br />
                <strong>Type:</strong> {tank.tank_type}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You have no tanks yet.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Livestock</h2>
        {livestock.length > 0 ? (
          <ul className="space-y-2">
            {livestock.map((item: any) => (
              <li key={item.id} className="bg-gray-800 p-4 rounded-lg">
                <strong>Species:</strong> {item.species}<br />
                <strong>Count:</strong> {item.count}<br />
                <strong>Tank ID:</strong> {item.tank_id}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You have no livestock yet.</p>
        )}
      </div>
    </div>
  )
}
