'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from URL parameters
        const session = await supabase.auth.getSessionFromUrl()
        
        if (session.error) {
          setError('Authentication failed: ' + session.error.message)
          setLoading(false)
          return
        }

        if (session.data.session) {
          // Set the session if we have one
          const { error: sessionError } = await supabase.auth.setSession(session.data.session)
          
          if (sessionError) {
            setError('Failed to set session: ' + sessionError.message)
            setLoading(false)
            return
          }
        }

        // Success - redirect to dashboard
        router.push('/dashboard')
        
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred during authentication')
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Signing you in...</h2>
          <p className="text-gray-400">Please wait while we complete your authentication.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 mb-6">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Error</h2>
            <p className="text-red-300 mb-4">{error}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // This shouldn't render as we should either be loading or have an error
  return null
}