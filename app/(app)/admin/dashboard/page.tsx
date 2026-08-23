'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarDays,
  CalendarClock,
  Users,
  CheckCircle2,
  Plus,
  Mail,
  CalendarX2,
  Trophy,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { apiGet } from '@/lib/api'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDateShort, formatNumber } from '@/lib/format'

/**
 * The last MUI page in the app.
 *
 * Bugs fixed here, all of which were visible in production:
 *  - Attendance rate computed `attendances / registrations * 100` inline and
 *    printed "NaN%" for any event with zero registrations, feeding NaN into a
 *    progress bar. The guard now lives in ProgressMeter, so no page can
 *    reintroduce it.
 *  - Rank medals had no upper bound, so every volunteer from 4th place down
 *    rendered bronze. Capped at 3.
 *  - Four stat "change" chips were hardcoded (e.g. "+15% this month") while a
 *    computed `trend` field went unused. They are derived now, and omitted
 *    when zero.
 *  - The "Analytics" quick action linked to /admin/analytics, which 404s.
 *    Removed rather than left pointing at nothing.
 */

interface AdminDashboard {
  stats: {
    totalEvents: number
    activeEvents: number
    totalVolunteers: number
    totalAttendance: number
  }
  deltas: { eventsThisMonth: number; volunteersThisMonth: number; attendanceThisMonth: number }
  newMessages: number
  recentEvents: Array<{
    id: string
    title: string
    location: string | null
    date: string
    type: string | null
    _count: { registrations: number; attendances: number }
  }>
  topVolunteers: Array<{
    id: string
    name: string
    email: string
    ecoTokens: number
    _count: { attendances: number; eventRegistrations: number }
  }>
}

const MEDAL = ['bg-[#B7912F] text-white', 'bg-[#9A9A9A] text-white', 'bg-[#A9713B] text-white']

function DashboardBody() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiGet<AdminDashboard>('/api/admin/dashboard'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="Couldn't load the dashboard"
        description="Something went wrong reaching the server."
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
        eyebrow="Admin"
        title="Dashboard"
        description="Events, volunteers and platform activity."
        actions={
          <div className="flex gap-2">
            {data.newMessages > 0 && (
              <Button asChild variant="secondary">
                <Link href="/admin/messages">
                  <Mail strokeWidth={1.75} />
                  {data.newMessages} new
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/admin/events/create">
                <Plus strokeWidth={1.75} />
                New event
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total events"
          value={stats.totalEvents}
          icon={CalendarDays}
          delta={
            deltas.eventsThisMonth > 0
              ? { value: deltas.eventsThisMonth, label: 'this month' }
              : null
          }
        />
        <StatCard label="Upcoming" value={stats.activeEvents} icon={CalendarClock} />
        <StatCard
          label="Volunteers"
          value={stats.totalVolunteers}
          icon={Users}
          delta={
            deltas.volunteersThisMonth > 0
              ? { value: deltas.volunteersThisMonth, label: 'this month' }
              : null
          }
        />
        <StatCard
          label="Check-ins"
          value={stats.totalAttendance}
          icon={CheckCircle2}
          delta={
            deltas.attendanceThisMonth > 0
              ? { value: deltas.attendanceThisMonth, label: 'this month' }
              : null
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Recent events</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/events">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {data.recentEvents.length === 0 ? (
                <div className="px-5 pb-5">
                  <EmptyState
                    icon={CalendarX2}
                    title="No events yet"
                    description="Create your first event to start taking registrations."
                    action={
                      <Button asChild>
                        <Link href="/admin/events/create">Create event</Link>
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Registered</TableHead>
                        <TableHead className="w-40">Attendance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentEvents.map((event) => {
                        const type = resolveEventType(event)
                        const Icon = type.icon
                        return (
                          <TableRow key={event.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                                  <Icon size={15} strokeWidth={1.75} />
                                </span>
                                <div className="min-w-0">
                                  <Link
                                    href={`/admin/events/${event.id}`}
                                    className="block truncate font-medium text-foreground transition-colors hover:text-primary-700"
                                  >
                                    {event.title}
                                  </Link>
                                  {event.location && (
                                    <span className="block truncate text-caption text-muted-foreground">
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {formatEventDateShort(event.date)}
                            </TableCell>
                            <TableCell className="tnum text-right">
                              {event._count.registrations}
                            </TableCell>
                            <TableCell>
                              {/* Zero registrations used to render NaN% here. */}
                              <ProgressMeter
                                value={event._count.attendances}
                                max={event._count.registrations}
                                emptyLabel="—"
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Top volunteers</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/volunteers">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.topVolunteers.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No check-ins yet"
                description="Volunteers appear here once they attend an event."
                className="border-0 px-0 py-6"
              />
            ) : (
              <ol className="space-y-4">
                {data.topVolunteers.map((v, i) => (
                  <li key={v.id} className="flex items-center gap-3">
                    <span
                      className={`tnum flex size-8 shrink-0 items-center justify-center rounded-full text-caption font-semibold ${
                        // Capped at 3 — previously every rank from 4th down
                        // rendered bronze.
                        i < 3 ? MEDAL[i] : 'bg-surface-sunken text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/volunteers/${v.id}`}
                        className="block truncate text-body-sm font-medium text-foreground transition-colors hover:text-primary-700"
                      >
                        {v.name}
                      </Link>
                      <span className="block truncate text-caption text-muted-foreground">
                        {v._count.attendances} attended · {formatNumber(v.ecoTokens)} tokens
                      </span>
                    </div>
                    <StatusPill tone="primary" className="shrink-0">
                      {v._count.attendances}
                    </StatusPill>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <DashboardBody />
    </AuthGuard>
  )
}
