'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Aquarium = {
  id: string
  name: string
  preferred_units: 'imperial' | 'metric'
}

type Tank = {
  id: string
  name: string
  volume: number
  tank_type: string
  custom_type: string | null
  aquarium_id: string
}

type Livestock = {
  tank_id: string
  quantity: number
}

export default function DashboardPage() {
  const [aquariums, setAquariums] = useState<Aquarium[]>([])
  const [tanks, setTanks] = useState<Tank[]>([])
  const [livestockMap, setLivestockMap] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchData = async () => {
      const { data: aquariumData } = await supabase
        .from('aquariums')
        .select('id, name, preferred_units')

      const { data: tankData } = await supabase
        .from('tanks')
        .select('id, name, volume, tank_type, custom_type, aquarium_id')

      const { data: livestockData } = await supabase
        .from('livestock')
        .select('tank_id, quantity')

      const livestockByTank: Record<string, number> = {}
      livestockData?.forEach(l => {
        livestockByTank[l.tank_id] = (livestockByTank[l.tank_id] || 0) + l.quantity
      })

      setAquariums(aquariumData || [])
      setTanks(tankData || [])
      setLivestockMap(livestockByTank)
    }

    fetchData()
  }, [])

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {aquariums.map(aq => {
        const aqTanks = tanks.filter(t => t.aquarium_id === aq.id)

        return (
          <div key={aq.id} className="mb-10 border p-4 rounded-lg border-white/20">
            <h2 className="text-xl font-semibold">{aq.name}</h2>
            <p className="text-sm text-white/60 mb-2">Units: {aq.preferred_units}</p>
            <p className="text-sm mb-4">Tanks: {aqTanks.length}</p>

            {aqTanks.map(tank => (
              <div
                key={tank.id}
                className="mb-4 p-3 border-l-4 border-teal-500 bg-white/5 rounded"
              >
                <h3 className="text-lg font-medium">{tank.name}</h3>
                <p className="text-sm">
                  Type:{' '}
                  {tank.tank_type === 'other' && tank.custom_type
                    ? tank.custom_type
                    : tank.tank_type.replaceAll('_', ' ')}
                </p>
                <p className="text-sm">
                  Volume: {tank.volume} {aq.preferred_units === 'imperial' ? 'gallons' : 'liters'}
                </p>
                <p className="text-sm">
                  Livestock: {livestockMap[tank.id] || 0}
                </p>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
