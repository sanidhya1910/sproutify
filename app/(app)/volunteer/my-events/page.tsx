'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { apiGet, apiDelete } from '@/lib/api'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDateShort, formatEventTime, isEventPast } from '@/lib/format'

/**
 * Rebuilt from a Tailwind page that used a native window.confirm() to gate
 * unregistering and native alert() for every error. Those are now an
 * AlertDialog and toasts.
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
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [pendingUnregister, setPendingUnregister] = useState<MyEvent | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => apiGet<MyEvent[]>('/api/volunteer/my-events'),
  })

  const unregister = useMutation({
    mutationFn: (eventId: string) => apiDelete('/api/volunteer/unregister', { eventId }),
    onSuccess: () => {
      toast.success('Registration cancelled')
      queryClient.invalidateQueries({ queryKey: ['my-events'] })
      queryClient.invalidateQueries({ queryKey: ['volunteer-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['volunteer-registrations'] })
    },
    onError: (e: Error) => toast.error(e.message || 'Could not cancel registration'),
    onSettled: () => setPendingUnregister(null),
  })

  const all = data ?? []
  const counts = useMemo(
    () => ({
      upcoming: all.filter((e) => !isEventPast(e.date)).length,
      past: all.filter((e) => isEventPast(e.date)).length,
      all: all.length,
    }),
    [all]
  )

  const events = useMemo(() => {
    if (tab === 'upcoming') return all.filter((e) => !isEventPast(e.date))
    if (tab === 'past') return all.filter((e) => isEventPast(e.date))
    return all
  }, [all, tab])

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
            description="Find something nearby and sign up — it takes a moment."
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
              const past = isEventPast(event.date)
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
                            {past && <StatusPill tone="neutral">Past</StatusPill>}
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
                        {!past && (
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
            <AlertDialogCancel disabled={unregister.isPending}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={unregister.isPending}
              onClick={(e) => {
                e.preventDefault()
                if (pendingUnregister) unregister.mutate(pendingUnregister.id)
              }}
            >
              {unregister.isPending ? 'Cancelling…' : 'Cancel registration'}
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
