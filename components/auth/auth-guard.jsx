"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children, requiredRole = null }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      if (payload.exp < currentTime) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      if (requiredRole && payload.role !== requiredRole) {
        router.push('/unauthorized')
        return
      }

      setIsAuthorized(true)
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return isAuthorized ? children : null
}