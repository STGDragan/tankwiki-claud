'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface Tank {
  id: string
  name: string
  volume: number
  tank_type: string
  custom_type?: string
}

interface Equipment {
  id: string
  name: string
  type: string
  status: string
  install_date: string
  notes?: string
}

interface Livestock {
  id: string
  species: string
  common_name?: string
  quantity: number
  health_status: string
  date_added: string
  notes?: string
}

interface MaintenanceLog {
  id: string
  task: string
  performed_at: string
  notes?: string
}

interface TestResult {
  id: string
  test_type: string
  value: number
  unit: string
  tested_at: string
  notes?: string
}

interface TankDetailPageProps {
  params: {
    id: string
  }
}

export default function TankDetailPage({ params }: TankDetailPageProps) {
  const [tank, setTank] = useState<Tank | null>(null)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const tankId = params.id

  useEffect(() => {
    fetchTankData()
  }, [tankId])

  const fetchTankData = async () => {
    try {
      setLoading(true)
      
      // Fetch tank details
      const { data: tankData, error: tankError } = await supabase
        .from('tanks')
        .select('id, name, volume, tank_type, custom_type')
        .eq('id', tankId)
        .single()

      if (tankError) {
        setError('Failed to fetch tank details: ' + tankError.message)
        return
      }

      if (!tankData) {
        setError('Tank not found')
        return
      }

      setTank(tankData)

      // Fetch equipment
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('equipment')
        .select('id, name, type, status, install_date, notes')
        .eq('tank_id', tankId)
        .order('install_date', { ascending: false })

      if (equipmentError) {
        console.error('Failed to fetch equipment:', equipmentError)
      } else {
        setEquipment(equipmentData || [])
      }

      // Fetch livestock
      const { data: livestockData, error: livestockError } = await supabase
        .from('livestock')
        .select('id, species, common_name, quantity, health_status, date_added, notes')
        .eq('tank_id', tankId)
        .order('date_added', { ascending: false })

      if (livestockError) {
        console.error('Failed to fetch livestock:', livestockError)
      } else {
        setLivestock(livestockData || [])
      }

      // Fetch maintenance logs (most recent 5)
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_logs')
        .select('id, task, performed_at, notes')
        .eq('tank_id', tankId)
        .order('performed_at', { ascending: false })
        .limit(5)

      if (maintenanceError) {
        console.error('Failed to fetch maintenance logs:', maintenanceError)
      } else {
        setMaintenanceLogs(maintenanceData || [])
      }

      // Fetch test results (most recent 5)
      const { data: testResultsData, error: testResultsError } = await supabase
        .from('test_results')
        .select('id, test_type, value, unit, tested_at, notes')
        .eq('tank_id', tankId)
        .order('tested_at', { ascending: false })
        .limit(5)

      if (testResultsError) {
        console.error('Failed to fetch test results:', testResultsError)
      } else {
        setTestResults(testResultsData || [])
      }

    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error fetching tank data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTankType = (tankType: string, customType?: string) => {
    if (tankType === 'other' && customType) {
      return customType
    }
    return tankType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'healthy':
      case 'running':
        return 'text-green-400 bg-green-900/30'
      case 'inactive':
      case 'sick':
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-900/30'
      case 'dead':
      case 'broken':
        return 'text-red-400 bg-red-900/30'
      default:
        return 'text-gray-400 bg-gray-900/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tank details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!tank) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">Tank not found</div>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white mb-2 inline-flex items-center"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-white">{tank.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-400">
                {tank.volume} gallons
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {formatTankType(tank.tank_type, tank.custom_type)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
              Edit Tank
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Add Equipment
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipment */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Equipment</h2>
            {equipment.length > 0 ? (
              <div className="space-y-4">
                {equipment.map((item) => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Type: {item.type}</p>
                      <p>Installed: {formatDate(item.install_date)}</p>
                      {item.notes && <p>Notes: {item.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No equipment added yet</p>
            )}
          </div>

          {/* Livestock */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Livestock</h2>
            {livestock.length > 0 ? (
              <div className="space-y-4">
                {livestock.map((animal) => (
                  <div key={animal.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">
                        {animal.common_name || animal.species}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">
                          {animal.quantity}x
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(animal.health_status)}`}>
                          {animal.health_status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      {animal.common_name && <p>Species: {animal.species}</p>}
                      <p>Added: {formatDate(animal.date_added)}</p>
                      {animal.notes && <p>Notes: {animal.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No livestock added yet</p>
            )}
          </div>

          {/* Maintenance Logs */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Recent Maintenance</h2>
            {maintenanceLogs.length > 0 ? (
              <div className="space-y-4">
                {maintenanceLogs.map((log) => (
                  <div key={log.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">{log.task}</h3>
                      <span className="text-sm text-gray-400">
                        {formatDateTime(log.performed_at)}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-gray-300">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No maintenance records yet</p>
            )}
          </div>

          {/* Test Results */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Recent Test Results</h2>
            {testResults.length > 0 ? (
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div key={result.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-white">{result.test_type}</h3>
                      <span className="text-sm text-gray-400">
                        {formatDateTime(result.tested_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-blue-400">
                        {result.value}
                      </span>
                      <span className="text-gray-300">{result.unit}</span>
                    </div>
                    {result.notes && (
                      <p className="text-sm text-gray-300">{result.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No test results yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}