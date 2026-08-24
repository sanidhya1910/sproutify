'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/lib/api'
import { useLocalOverrides, setLocalRegistration } from '@/lib/local-overrides'
import { isEventPast } from '@/lib/format'
import type { EventCardEvent } from '@/components/events/EventCard'

interface Registration {
  eventId: string
}

/**
 * The single source of truth for "am I registered for this event" across
 * the browse list, the event detail page, my-events and the dashboard.
 *
 * Registering/cancelling for an upcoming event never calls the server (see
 * lib/local-overrides.ts) — it sets a session-only override that layers on
 * top of the real seeded baseline. This hook does that layering once so the
 * four consuming pages can't drift out of sync with each other.
 */
export function useEffectiveRegistrations() {
  const catalogQuery = useQuery({
    queryKey: ['volunteer-events'],
    queryFn: () => apiGet<EventCardEvent[]>('/api/volunteer/events'),
  })
  const serverQuery = useQuery({
    queryKey: ['volunteer-registrations'],
    queryFn: () => apiGet<Registration[]>('/api/volunteer/registrations'),
  })
  const overrides = useLocalOverrides()

  const effectiveIds = useMemo(() => {
    const ids = new Set((serverQuery.data ?? []).map((r) => r.eventId))
    for (const [eventId, registered] of Object.entries(overrides)) {
      if (registered) ids.add(eventId)
      else ids.delete(eventId)
    }
    return ids
  }, [serverQuery.data, overrides])

  const registeredEvents = useMemo(
    () => (catalogQuery.data ?? []).filter((e) => effectiveIds.has(e.id)),
    [catalogQuery.data, effectiveIds]
  )

  const registeredUpcomingEvents = useMemo(
    () => registeredEvents.filter((e) => !isEventPast(e.date)),
    [registeredEvents]
  )

  return {
    isLoading: catalogQuery.isLoading || serverQuery.isLoading,
    isError: catalogQuery.isError || serverQuery.isError,
    effectiveIds,
    registeredEvents,
    registeredUpcomingEvents,
    isRegistered: (eventId: string) => effectiveIds.has(eventId),
    /** Local-only — never hits the API. Past events can't be registered for;
     *  callers already hide the control in that case. */
    register: (eventId: string) => setLocalRegistration(eventId, true),
    unregister: (eventId: string) => setLocalRegistration(eventId, false),
  }
}
