'use client'

import { useEffect, useState } from 'react'

export type SessionRole = 'ADMIN' | 'VOLUNTEER' | 'ORGANIZER' | null

/**
 * Decodes the role straight from the JWT, same as AppShell does for the nav.
 *
 * Used on pages shared between ADMIN and ORGANIZER (the event management
 * surfaces) to swap the "Admin" eyebrow for "Host" — an NGO managing its own
 * events should not read a page labelled for platform staff.
 */
export function useSessionRole(): SessionRole {
  const [role, setRole] = useState<SessionRole>(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const claims = JSON.parse(atob(token.split('.')[1]))
      setRole(claims.role ?? null)
    } catch {
      // AuthGuard handles the redirect for a malformed token.
    }
  }, [])
  return role
}
