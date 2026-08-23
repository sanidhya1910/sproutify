'use client'

import { use } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  CalendarX2,
  CheckCircle2,
  Backpack,
} from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { AssetImage } from '@/components/patterns/AssetImage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiGet, apiPost, apiDelete, ApiError } from '@/lib/api'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDate, formatEventTime, isEventPast } from '@/lib/format'
import type { AssetId } from '@/lib/assets'
import type { EventCardEvent } from '@/components/events/EventCard'

/**
 * Rebuilt from a Tailwind page whose primary action colour was blue on a
 * green-branded product, and which used native alert() for every error.
 *
 * The "What to bring" list is preserved from the original copy.
 */

const WHAT_TO_BRING = [
  'Reusable water bottle',
  'Sun protection (hat, sunscreen)',
  'Comfortable walking shoes',
  'Work gloves, if you have them',
  'A positive attitude',
] as const

function EventBody({ id }: { id: string }) {
  const queryClient = useQueryClient()

  const eventQuery = useQuery({
    queryKey: ['volunteer-event', id],
    queryFn: () => apiGet<EventCardEvent>(`/api/volunteer/events/${id}`),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 2,
  })

  const registrationQuery = useQuery({
    queryKey: ['volunteer-event-registration', id],
    queryFn: () => apiGet<{ isRegistered: boolean }>(`/api/volunteer/events/${id}/registration`),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['volunteer-event-registration', id] })
    queryClient.invalidateQueries({ queryKey: ['volunteer-event', id] })
    queryClient.invalidateQueries({ queryKey: ['my-events'] })
    queryClient.invalidateQueries({ queryKey: ['volunteer-dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['volunteer-registrations'] })
  }

  const register = useMutation({
    mutationFn: () => apiPost('/api/volunteer/register', { eventId: id }),
    onSuccess: () => {
      toast.success('You are registered — see you there')
      invalidate()
    },
    onError: (e: Error) => toast.error(e.message || 'Registration failed'),
  })

  const unregister = useMutation({
    mutationFn: () => apiDelete('/api/volunteer/unregister', { eventId: id }),
    onSuccess: () => {
      toast.success('Registration cancelled')
      invalidate()
    },
    onError: (e: Error) => toast.error(e.message || 'Could not cancel registration'),
  })

  if (eventQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[280px] rounded-lg" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    )
  }

  if (eventQuery.error || !eventQuery.data) {
    const notFound = eventQuery.error instanceof ApiError && eventQuery.error.status === 404
    return (
      <EmptyState
        icon={CalendarX2}
        title={notFound ? 'Event not found' : "Couldn't load this event"}
        description={
          notFound
            ? 'This event may have been removed, or the link may be out of date.'
            : 'Something went wrong reaching the server.'
        }
        action={
          <Button asChild variant="secondary">
            <Link href="/volunteer/events">Browse events</Link>
          </Button>
        }
      />
    )
  }

  const event = eventQuery.data
  const type = resolveEventType(event)
  const Icon = type.icon
  const past = isEventPast(event.date)
  const time = formatEventTime(event.startTime, event.endTime)
  const registered = registrationQuery.data?.isRegistered ?? false
  const busy = register.isPending || unregister.isPending

  return (
    <>
      <Link
        href="/volunteer/events"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        All events
      </Link>

      <div className="mt-5 overflow-hidden rounded-lg border border-border">
        <AssetImage
          slot={type.artSlot as AssetId}
          icon={Icon}
          alt=""
          override={event.imageUrl}
          className="h-[200px] object-cover md:h-[280px]"
          sizes="100vw"
        />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={type.tone}>
              <Icon size={13} strokeWidth={2} />
              {type.label}
            </StatusPill>
            {past && <StatusPill tone="neutral">Past event</StatusPill>}
            {registered && !past && (
              <StatusPill tone="success">
                <CheckCircle2 size={13} strokeWidth={2} />
                You are registered
              </StatusPill>
            )}
          </div>

          <h1 className="mt-3 text-display-lg text-foreground">{event.title}</h1>

          {event.description && (
            <div className="mt-6">
              <h2 className="text-h3 text-foreground">About this event</h2>
              <p className="mt-2 whitespace-pre-line text-body-lg text-muted-foreground">
                {event.description}
              </p>
            </div>
          )}

          {event.safetyInstructions && (
            <Card className="mt-8 border-warning/30 bg-warning-subtle p-5">
              <div className="flex gap-3">
                <ShieldAlert
                  size={18}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-warning"
                />
                <div>
                  <h3 className="text-h4 text-foreground">Safety instructions</h3>
                  <p className="mt-1 whitespace-pre-line text-body-sm text-foreground/80">
                    {event.safetyInstructions}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4 text-body-sm">
                <div className="flex gap-3">
                  <CalendarDays
                    size={16}
                    strokeWidth={1.75}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="text-foreground">{formatEventDate(event.date)}</dd>
                  </div>
                </div>
                {time && (
                  <div className="flex gap-3">
                    <Clock
                      size={16}
                      strokeWidth={1.75}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <div>
                      <dt className="text-muted-foreground">Time</dt>
                      <dd className="text-foreground">{time}</dd>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex gap-3">
                    <MapPin
                      size={16}
                      strokeWidth={1.75}
                      className="mt-0.5 shrink-0 text-muted-foreground"
                    />
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="text-foreground">{event.location}</dd>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <Users
                    size={16}
                    strokeWidth={1.75}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div>
                    <dt className="text-muted-foreground">Volunteers</dt>
                    <dd className="tnum text-foreground">
                      {event._count?.registrations ?? 0} registered
                      {event.expectedVolunteers ? ` of ${event.expectedVolunteers} needed` : ''}
                    </dd>
                  </div>
                </div>
              </dl>

              {!past && (
                <div className="mt-6 border-t border-border pt-5">
                  {registered ? (
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={busy}
                      onClick={() => unregister.mutate()}
                    >
                      {unregister.isPending ? 'Cancelling…' : 'Cancel registration'}
                    </Button>
                  ) : (
                    <Button className="w-full" disabled={busy} onClick={() => register.mutate()}>
                      {register.isPending ? 'Registering…' : 'Register for this event'}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Backpack size={17} strokeWidth={1.75} className="text-primary-700" />
                What to bring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-body-sm text-muted-foreground">
                {WHAT_TO_BRING.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-caption text-subtle-foreground">
                Cleanup supplies and bags are provided on the day.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  )
}

export default function VolunteerEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return (
    <AuthGuard requiredRole="VOLUNTEER">
      <EventBody id={id} />
    </AuthGuard>
  )
}
