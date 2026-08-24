'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Auth is hand-rolled JWT held in localStorage — NOT next-auth (which was an
 * installed-but-unused dependency, removed in Phase 0). The decode/expiry/
 * role logic below is preserved exactly as it was; only the loading UI
 * changed, from a blue spinner to a neutral skeleton.
 *
 * Note this is a client-side redirect for UX only. Real authorisation is
 * enforced per-route in app/api/**, which is where it must stay.
 */
type Role = 'ADMIN' | 'VOLUNTEER' | 'ORGANIZER'

export default function AuthGuard({
  children,
  requiredRole = null,
}: {
  children: React.ReactNode
  /** A single role, or any of several — e.g. admin event pages accept both
   *  ADMIN (sees everything) and ORGANIZER (scoped to their own events). */
  requiredRole?: Role | Role[] | null
}) {
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

      const allowedRoles = requiredRole == null ? null : Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (allowedRoles && !allowedRoles.includes(payload.role)) {
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
    // Skeleton rather than a bare spinner, so the redirect doesn't flash a
    // blank screen on slower devices.
    return (
      <div className="min-h-dvh bg-background">
        <div className="h-16 border-b border-border" />
        <div className="mx-auto w-full max-w-[1200px] space-y-4 px-5 py-8 md:px-8">
          <div className="h-8 w-48 animate-pulse rounded-md bg-surface-sunken" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-28 animate-pulse rounded-lg bg-surface-sunken" />
            <div className="h-28 animate-pulse rounded-lg bg-surface-sunken" />
            <div className="h-28 animate-pulse rounded-lg bg-surface-sunken" />
          </div>
        </div>
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}
