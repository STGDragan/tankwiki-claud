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
        <h2 clas
