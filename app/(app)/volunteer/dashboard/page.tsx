'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarCheck,
  CalendarClock,
  Leaf,
  Gift,
  ArrowRight,
  CalendarX2,
  History,
} from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { StatCard } from '@/components/patterns/StatCard'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { ProgressMeter } from '@/components/patterns/ProgressMeter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiGet } from '@/lib/api'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDateShort, formatEventTime, formatRelative } from '@/lib/format'

/**
 * Rebuilt from an MUI page that carried six different gradient backgrounds on
 * one screen (a grey-blue page, a purple level card, amber and blue activity
 * cards) on a green-branded product, and whose three stat "change" chips —
 * "+8 this month", "2 this week", "+25 today" — were hardcoded strings
 * rendered regardless of the real data. Those now come from the API, and are
 * omitted entirely when zero.
 */

interface DashboardData {
  user: { name: string; memberSince: string | null }
  stats: { registeredEvents: number; attendedEvents: number; upcomingEvents: number }
  deltas: { attendedThisMonth: number; upcomingThisWeek: number; tokensThisMonth: number }
  upcomingEvents: Array<{
    id: string
    title: string
    location: string | null
    date: string
    startTime: string | null
    endTime: string | null
    type: string | null
  }>
  recentAttendances: Array<{
    checkedInAt: string
    event: { id: string; title: string; location: string | null; date: string; type: string | null }
  }>
  ecoTokens: number
  volunteerLevel: number
  progress: number
  eventsToNextLevel: number
}

function DashboardBody() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['volunteer-dashboard'],
    queryFn: () => apiGet<DashboardData>('/api/volunteer/dashboard'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <Skeleton className="h-72 rounded-lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="Couldn't load your dashboard"
        description="Something went wrong reaching the server. Your data is safe — this is just a loading problem."
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  const { stats, deltas } = data

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${data.user.name}`}
        description="Your events, impact and EcoTokens at a glance."
        actions={
          <Button asChild>
            <Link href="/volunteer/events">
              Browse events
              <ArrowRight strokeWidth={1.75} />
            </Link>
          </Button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Events attended"
          value={stats.attendedEvents}
          icon={CalendarCheck}
          delta={
            deltas.attendedThisMonth > 0
              ? { value: deltas.attendedThisMonth, label: 'this month' }
              : null
          }
        />
        <StatCard
          label="Upcoming events"
          value={stats.upcomingEvents}
          icon={CalendarClock}
          delta={
            deltas.upcomingThisWeek > 0
              ? { value: deltas.upcomingThisWeek, label: 'this week' }
              : null
          }
        />
        <StatCard
          label="EcoTokens"
          value={data.ecoTokens}
          icon={Leaf}
          delta={
            deltas.tokensThisMonth > 0
              ? { value: deltas.tokensThisMonth, label: 'this month' }
              : null
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Your upcoming events</CardTitle>
              {data.upcomingEvents.length > 0 && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/volunteer/my-events">View all</Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {data.upcomingEvents.length === 0 ? (
                <EmptyState
                  icon={CalendarX2}
                  title="Nothing scheduled yet"
                  description="Register for an event and it will show up here."
                  action={
                    <Button asChild>
                      <Link href="/volunteer/events">Find an event</Link>
                    </Button>
                  }
                />
              ) : (
                <ul className="divide-y divide-border">
                  {data.upcomingEvents.map((event) => {
                    const type = resolveEventType(event)
                    const Icon = type.icon
                    return (
                      <li
                        key={event.id}
                        className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                            <Icon size={17} strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={`/volunteer/events/${event.id}`}
                              className="text-body font-medium text-foreground transition-colors hover:text-primary-700"
                            >
                              {event.title}
                            </Link>
                            <p className="mt-0.5 truncate text-body-sm text-muted-foreground">
                              {formatEventDateShort(event.date)}
                              {formatEventTime(event.startTime, event.endTime) &&
                                ` · ${formatEventTime(event.startTime, event.endTime)}`}
                              {event.location && ` · ${event.location}`}
                            </p>
                          </div>
                        </div>
                        <Button asChild variant="secondary" size="sm" className="shrink-0">
                          <Link href={`/volunteer/events/${event.id}`}>Details</Link>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Level {data.volunteerLevel}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressMeter
                value={data.progress}
                label="Progress to next level"
                tone="primary"
              />
              <p className="mt-3 text-body-sm text-muted-foreground">
                {data.eventsToNextLevel} more{' '}
                {data.eventsToNextLevel === 1 ? 'event' : 'events'} to reach level{' '}
                {data.volunteerLevel + 1}.
              </p>

              <div className="mt-5 flex items-center justify-between rounded-md bg-surface-sunken p-3">
                <div className="flex items-center gap-2">
                  <Leaf size={16} strokeWidth={1.75} className="text-primary-700" />
                  <span className="tnum text-body font-medium text-foreground">
                    {data.ecoTokens}
                  </span>
                  <span className="text-body-sm text-muted-foreground">EcoTokens</span>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/volunteer/redeem-shop">
                    <Gift strokeWidth={1.75} />
                    Redeem
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentAttendances.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="No activity yet"
                  description="Check in at an event to start building your history."
                  className="border-0 px-0 py-6"
                />
              ) : (
                <ul className="space-y-4">
                  {data.recentAttendances.map((a) => {
                    const type = resolveEventType(a.event)
                    return (
                      <li key={a.event.id} className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-body-sm font-medium text-foreground">
                            {a.event.title}
                          </p>
                          <p className="text-caption text-muted-foreground">
                            Attended {formatRelative(a.checkedInAt)}
                          </p>
                        </div>
                        <StatusPill tone={type.tone} className="shrink-0">
                          {type.label}
                        </StatusPill>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default function VolunteerDashboardPage() {
  return (
    <AuthGuard requiredRole="VOLUNTEER">
      <DashboardBody />
    </AuthGuard>
  )
}
