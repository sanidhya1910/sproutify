'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CalendarX2, MapPin, CalendarDays, CheckCircle2 } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { apiGet } from '@/lib/api'
import { useEffectiveRegistrations } from '@/lib/use-effective-registrations'
import { useLocalOverrides } from '@/lib/local-overrides'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDateShort, formatEventTime, isEventPast } from '@/lib/format'

/**
 * Rebuilt from a Tailwind page that used a native window.confirm() to gate
 * unregistering and native alert() for every error. Those are now an
 * AlertDialog and toasts.
 *
 * "Past" is always the real seeded history from the server — you cannot
 * register or cancel for a past event, so nothing here is session-local.
 * "Upcoming" merges that same server baseline with session-only overrides
 * (lib/local-overrides.ts): a locally-added registration for an event the
 * server doesn't know about is pulled in from the full events catalog via
 * useEffectiveRegistrations, and a local cancellation hides a seeded
 * registration without touching it.
 */

interface MyEvent {
  id: string
  title: string
  description?: string | null
  location?: string | null
  date: string
  startTime?: string | null
  endTime?: string | null
  type?: string | null
  attendances?: Array<{ userId: string }>
}

function MyEventsBody() {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [pendingUnregister, setPendingUnregister] = useState<MyEvent | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => apiGet<MyEvent[]>('/api/volunteer/my-events'),
  })

  const { registeredUpcomingEvents, unregister } = useEffectiveRegistrations()
  const overrides = useLocalOverrides()

  const serverEvents = data ?? []
  const past = useMemo(() => serverEvents.filter((e) => isEventPast(e.date)), [serverEvents])

  // Server upcoming, minus anything locally cancelled this session, plus
  // anything locally registered this session that the server doesn't know
  // about yet — deduped by id, server copy wins (it carries `attendances`).
  const upcoming = useMemo(() => {
    const serverUpcoming = serverEvents.filter(
      (e) => !isEventPast(e.date) && overrides[e.id] !== false
    )
    const knownIds = new Set(serverUpcoming.map((e) => e.id))
    // Normalised to MyEvent shape: a locally-registered event sourced from
    // the catalog never has real `attendances` (it's upcoming, by
    // definition unattended) and its `date` is always present for anything
    // that made it through isEventPast, so the cast is safe.
    const localOnly: MyEvent[] = registeredUpcomingEvents
      .filter((e) => !knownIds.has(e.id) && e.date)
      .map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        date: e.date as string,
        startTime: e.startTime,
        endTime: e.endTime,
        type: e.type,
      }))
    return [...serverUpcoming, ...localOnly]
  }, [serverEvents, overrides, registeredUpcomingEvents])

  const all = useMemo(() => [...upcoming, ...past], [upcoming, past])

  const counts = { upcoming: upcoming.length, past: past.length, all: all.length }

  const events = tab === 'upcoming' ? upcoming : tab === 'past' ? past : all

  const handleUnregister = (event: MyEvent) => {
    unregister(event.id)
    toast.success('Registration cancelled')
    setPendingUnregister(null)
  }

  return (
    <>
      <PageHeader
        eyebrow="My events"
        title="Your registrations"
        description="Everything you have signed up for, and everything you have attended."
        actions={
          <Button asChild variant="secondary">
            <Link href="/volunteer/events">Browse events</Link>
          </Button>
        }
      />

      <div className="mt-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({counts.upcoming})</TabsTrigger>
            <TabsTrigger value="past">Past ({counts.past})</TabsTrigger>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
        ) : isError ? (
          <EmptyState
            icon={CalendarX2}
            title="Couldn't load your events"
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title={
              tab === 'upcoming'
                ? 'No upcoming events'
                : tab === 'past'
                  ? 'No past events yet'
                  : 'You have not registered for anything yet'
            }
            description="Find something nearby and sign up. It only takes a moment."
            action={
              <Button asChild>
                <Link href="/volunteer/events">Browse events</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            {events.map((event) => {
              const type = resolveEventType(event)
              const Icon = type.icon
              const isPast = isEventPast(event.date)
              const attended = (event.attendances?.length ?? 0) > 0
              const time = formatEventTime(event.startTime, event.endTime)

              return (
                <li key={event.id}>
                  <Card className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                          <Icon size={18} strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/volunteer/events/${event.id}`}
                              className="text-h4 text-foreground transition-colors hover:text-primary-700"
                            >
                              {event.title}
                            </Link>
                            {isPast && <StatusPill tone="neutral">Past</StatusPill>}
                            {attended && (
                              <StatusPill tone="success">
                                <CheckCircle2 size={13} strokeWidth={2} />
                                Attended
                              </StatusPill>
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={14} strokeWidth={1.75} />
                              {formatEventDateShort(event.date)}
                              {time && ` · ${time}`}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={14} strokeWidth={1.75} />
                                {event.location}
                              </span>
                            )}
                          </div>

                          {event.description && (
                            <p className="mt-2 line-clamp-2 text-body-sm text-muted-foreground">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/volunteer/events/${event.id}`}>Details</Link>
                        </Button>
                        {!isPast && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive-subtle hover:text-destructive"
                            onClick={() => setPendingUnregister(event)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <AlertDialog
        open={!!pendingUnregister}
        onOpenChange={(open) => !open && setPendingUnregister(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel your registration?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be removed from{' '}
              <span className="font-medium text-foreground">{pendingUnregister?.title}</span>. You
              can register again later if there is still space.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault()
                if (pendingUnregister) handleUnregister(pendingUnregister)
              }}
            >
              Cancel registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function MyEventsPage() {
  return (
    <AuthGuard requiredRole="VOLUNTEER">
      <MyEventsBody />
    </AuthGuard>
  )
}
