'use client'

import { useEffect, useState } from 'react'
import { readLocalAccount } from '@/lib/demo'

/**
 * The name to show for the signed-in person.
 *
 * In demo builds someone can "register" without a database row; that profile
 * borrows the demo volunteer's session, so anything reading the name from the
 * API (or from the JWT) reports the borrowed account instead. Without a single
 * shared resolver the app shell and the dashboard greeting disagreed on screen:
 * the header said the registered name while the page heading said the seeded
 * one.
 *
 * Returns `fallback` unchanged whenever there is no borrowed session, so
 * ordinary sign-ins are untouched.
 */
export function useDisplayName(fallback: string | undefined): string | undefined {
  const [name, setName] = useState<string | undefined>(fallback)

  useEffect(() => {
    setName(fallback)

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return

    const local = readLocalAccount()
    if (!local) return

    try {
      const claims = JSON.parse(atob(token.split('.')[1])) as { email?: string }
      if (claims.email && claims.email === local.backedBy) {
        setName(local.name)
      }
    } catch {
      // Malformed token: AuthGuard handles the redirect.
    }
  }, [fallback])

  return name
}
