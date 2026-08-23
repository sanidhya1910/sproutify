'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  CalendarX2,
} from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { AssetImage } from '@/components/patterns/AssetImage'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDate, formatEventTime, isEventPast } from '@/lib/format'
import { apiGet, ApiError } from '@/lib/api'
import type { AssetId } from '@/lib/assets'
import type { EventCardEvent } from '@/components/events/EventCard'

/**
 * Rebuilt from a page that fetched `/api/admin/events/${id}` with a bearer
 * token — an ADMIN endpoint on a PUBLIC route, so it 403'd for every
 * anonymous visitor. It also rendered `organizer`, `contactEmail`,
 * `contactPhone` and `details[]`, none of which exist on the Prisma Event, so
 * those rows were permanently blank.
 */
export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-event', id],
    queryFn: () => apiGet<EventCardEvent>(`/api/public/events/${id}`, false),
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 2,
  })

  if (isLoading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-6 h-[320px] w-full rounded-lg" />
        <Skeleton className="mt-6 h-10 w-2/3" />
      </Container>
    )
  }

  if (error || !data) {
    const notFound = error instanceof ApiError && error.status === 404
    return (
      <Container className="py-16">
        <EmptyState
          icon={CalendarX2}
          title={notFound ? 'Event not found' : "Couldn't load this event"}
          description={
            notFound
              ? 'This event may have been removed, or the link may be out of date.'
              : 'Something went wrong reaching the server. Please try again shortly.'
          }
          action={
            <Button asChild variant="secondary">
              <Link href="/events">Browse all events</Link>
            </Button>
          }
        />
      </Container>
    )
  }

  const type = resolveEventType(data)
  const Icon = type.icon
  const past = isEventPast(data.date)
  const time = formatEventTime(data.startTime, data.endTime)
  const registered = data._count?.registrations ?? 0

  return (
    <Container className="py-10 md:py-14">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        All events
      </Link>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <AssetImage
          slot={type.artSlot as AssetId}
          icon={Icon}
          alt=""
          override={data.imageUrl}
          className="h-[240px] object-cover md:h-[340px]"
          sizes="(min-width: 1200px) 1136px, 100vw"
        />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={type.tone}>
              <Icon size={13} strokeWidth={2} />
              {type.label}
            </StatusPill>
            {past && <StatusPill tone="neutral">Past event</StatusPill>}
          </div>

          <h1 className="mt-3 text-display-lg text-foreground">{data.title}</h1>

          {data.description && (
            <div className="mt-6">
              <h2 className="text-h3 text-foreground">About this event</h2>
              <p className="mt-2 whitespace-pre-line text-body-lg text-muted-foreground">
                {data.description}
              </p>
            </div>
          )}

          {data.safetyInstructions && (
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
                    {data.safetyInstructions}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <aside className="lg:col-span-1">
          <Card className="p-5">
            <h2 className="text-h4 text-foreground">Details</h2>
            <dl className="mt-4 space-y-4 text-body-sm">
              <div className="flex gap-3">
                <CalendarDays
                  size={16}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div>
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="text-foreground">{formatEventDate(data.date)}</dd>
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
              {data.location && (
                <div className="flex gap-3">
                  <MapPin
                    size={16}
                    strokeWidth={1.75}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div>
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="text-foreground">{data.location}</dd>
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
                    {registered} registered
                    {data.expectedVolunteers ? ` of ${data.expectedVolunteers} needed` : ''}
                  </dd>
                </div>
              </div>
            </dl>

            {!past && (
              <div className="mt-6 border-t border-border pt-5">
                <Button asChild className="w-full">
                  <Link href={`/login?redirect=/volunteer/events/${data.id}`}>
                    Sign in to register
                  </Link>
                </Button>
                <p className="mt-2 text-center text-caption text-muted-foreground">
                  New here?{' '}
                  <Link
                    href="/register"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </Container>
  )
}
