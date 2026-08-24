'use client'

import { useEffect, useState } from 'react'

/**
 * Session-only registration overrides.
 *
 * Registering or cancelling for an UPCOMING event never touches the
 * database in this build. The seeded baseline (who's really registered for
 * what, per the demo dataset) stays exactly as seeded; what a visitor does
 * during their session is layered on top as a local override and cleared on
 * logout, so nobody's click-through leaves a mark on the shared demo data.
 *
 * Deliberately an OVERRIDE, not a replacement: `true` means "registered this
 * session" and `false` means "cancelled this session" — both take priority
 * over the server baseline, but a missing entry falls back to whatever the
 * server actually says. That's what makes "reset on logout" safe: clearing
 * the map just lets the real seeded state show through again, rather than
 * erasing it.
 */

const KEY = 'sproutify.demo.eventOverrides'
const CHANGE_EVENT = 'sproutify:overrides-changed'

export type Overrides = Record<string, boolean>

function read(): Overrides {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

function write(next: Overrides) {
  window.localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function setLocalRegistration(eventId: string, registered: boolean) {
  write({ ...read(), [eventId]: registered })
}

/** Called on logout — the whole point of "resets on logout". */
export function clearLocalOverrides() {
  window.localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Reactive read, for components that render registered/unregistered state. */
export function useLocalOverrides(): Overrides {
  const [state, setState] = useState<Overrides>({})

  useEffect(() => {
    setState(read())
    const handler = () => setState(read())
    window.addEventListener(CHANGE_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return state
}
