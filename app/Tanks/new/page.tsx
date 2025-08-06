'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface Aquarium {
  id: string
  name: string
}

const tankTypeOptions = [
  { value: 'freshwater', label: 'Freshwater' },
  { value: 'freshwater_planted', label: 'Freshwater Planted' },
  { value: 'brackish', label: 'Brackish' },
  { value: 'saltwater_fish_only', label: 'Saltwater Fish Only' },
  { value: 'saltwater_fowlr', label: 'Saltwater FOWLR' },
  { value: 'saltwater_reef', label: 'Saltwater Reef' },
  { value: 'other', label: 'Other' }
]

export default function NewTankPage() {
  const [aquariums, setAquariums] = useState<Aquarium[]>([])
  const [selectedAquariumId, setSelectedAquariumId] = useState('')
  const [name, setName] = useState('')
  const [volume, setVolume] = useState('')
  const [tankType, setTankType] = useState('')
  const [customType, setCustomType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aquariumsLoading, setAquariumsLoading] = useState(true)
  
  const router = useRouter()

  // Fetch user's aquariums on component mount
  useEffect(() => {
    fetchAquariums()
  }, [])

  const fetchAquariums = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('User not authenticated')
        setAquariumsLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('aquariums')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name')

      if (fetchError) {
        setError('Failed to fetch aquariums: ' + fetchError.message)
      } else {
        setAquariums(data || [])
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching aquariums')
    } finally {
      setAquariumsLoading(false)
    }
  }

  const validateForm = () => {
    if (!selectedAquariumId) {
      setError('Please select an aquarium')
      return false
    }
    
    if (!name.trim()) {
      setError('Tank name is required')
      return false
    }
    
    if (!volume || parseFloat(volume) <= 0) {
      setError('Please enter a valid volume')
      return false
    }
    
    if (!tankType) {
      setError('Please select a tank type')
      return false
    }
    
    if (tankType === 'other' && !customType.trim()) {
      setError('Please specify the custom tank type')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('User not authenticated')
        setLoading(false)
        return
      }

      const tankData = {
        name: name.trim(),
        volume: parseFloat(volume),
        tank_type: tankType === 'other' ? customType.trim() : tankType,
        aquarium_id: selectedAquariumId,
        user_id: user.id
      }

      const { error: insertError } = await supabase
        .from('tanks')
        .insert([tankData])

      if (insertError) {
        setError('Failed to create tank: ' + insertError.message)
      } else {
        // Success - redirect to dashboard
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (aquariumsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading aquariums...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Create New Tank</h1>
          
          {aquariums.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">
                You need to create an aquarium first before adding tanks.
              </p>
              <button
                onClick={() => router.push('/aquariums/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create Aquarium
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Aquarium Selection */}
              <div>
                <label htmlFor="aquarium" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Aquarium *
                </label>
                <select
                  id="aquarium"
                  value={selectedAquariumId}
                  onChange={(e) => setSelectedAquariumId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose an aquarium...</option>
                  {aquariums.map((aquarium) => (
                    <option key={aquarium.id} value={aquarium.id}>
                      {aquarium.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tank Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Tank Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Main Display Tank"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Volume */}
              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-gray-300 mb-2">
                  Volume (gallons) *
                </label>
                <input
                  type="number"
                  id="volume"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="e.g., 55"
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Tank Type */}
              <div>
                <label htmlFor="tankType" className="block text-sm font-medium text-gray-300 mb-2">
                  Tank Type *
                </label>
                <select
                  id="tankType"
                  value={tankType}
                  onChange={(e) => setTankType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select tank type...</option>
                  {tankTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Type Input (shown when "other" is selected) */}
              {tankType === 'other' && (
                <div>
                  <label htmlFor="customType" className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Tank Type *
                  </label>
                  <input
                    type="text"
                    id="customType"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Specify your tank type"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>
                  ) : (
                    'Create Tank'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}