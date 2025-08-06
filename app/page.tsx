'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomeRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard')
  }, [router])

  return (
    <div className="text-white p-4">Redirecting to dashboard...</div>
  )
}
