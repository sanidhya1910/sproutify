'use client'

import { use } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Pencil,
  QrCode,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CalendarX2,
  UserCheck,
  UserMinus,
} from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { ProgressMeter } from '@/components/patterns/ProgressMeter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiGet, apiPost, apiDelete } from '@/lib/api'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDate, formatEventTime, isEventPast } from '@/lib/format'

/**
 * Attendance marking previously used native alert() for every error, and its
 * blue/teal gradient avatars were off-brand. The attendance rate was also
 * computed inline in four separate places on this page; it now goes through
 * ProgressMeter, which guards the zero-denominator case.
 */

interface Registrant {
  user: { id: string; name: string; email: string }
  createdAt: string
}

interface AdminEventDetail {
  id: string
  title: string
  description: string
  location: string | null
  date: string
  startTime: string | null
  endTime: string | null
  type: string | null
  expectedVolunteers: number | null
  safetyInstructions: string | null
  creator: { name: string; email: string } | null
  registrations: Registrant[]
  attendances: Array<{ user: { id: string } }>
  _count: { registrations: number; attendances: number }
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function DetailBody({ id }: { id: string }) {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-event', id],
    queryFn: () => apiGet<AdminEventDetail>(`/api/admin/events/${id}`),
  })

  const mark = useMutation({
    mutationFn: ({ userId, attended }: { userId: string; attended: boolean }) =>
      attended
        ? apiDelete(`/api/admin/events/${id}/attendance`, { userId })
        : apiPost(`/api/admin/events/${id}/attendance`, { userId }),
    onSuccess: (res: unknown) => {
      toast.success((res as { message?: string })?.message || 'Attendance updated')
      queryClient.invalidateQueries({ queryKey: ['admin-event', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
    onError: (e: Error) => toast.error(e.message || 'Could not update attendance'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="Couldn't load this event"
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  const type = resolveEventType(data)
  const Icon = type.icon
  const past = isEventPast(data.date)
  const attendedIds = new Set(data.attendances.map((a) => a.user.id))

  return (
    <>
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        All events
      </Link>

      <div className="mt-5">
        <PageHeader
          eyebrow={type.label}
          title={data.title}
          actions={
            <div className="flex gap-2">
              <Button asChild variant="secondary">
                <Link href={`/admin/events/${id}/qr`}>
                  <QrCode strokeWidth={1.75} />
                  QR code
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/admin/events/${id}/edit`}>
                  <Pencil strokeWidth={1.75} />
                  Edit
                </Link>
              </Button>
            </div>
          }
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Registered volunteers</CardTitle>
              <StatusPill tone="neutral">{data._count.registrations}</StatusPill>
            </CardHeader>
            <CardContent>
              {data.registrations.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No registrations yet"
                  description="Volunteers who sign up will appear here, ready to check in."
                  className="border-0 px-0 py-8"
                />
              ) : (
                <ul className="divide-y divide-border">
                  {data.registrations.map((reg) => {
                    const attended = attendedIds.has(reg.user.id)
                    const busy =
                      mark.isPending && mark.variables?.userId === reg.user.id
                    return (
                      <li
                        key={reg.user.id}
                        className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-800">
                            {initials(reg.user.name)}
                          </span>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/volunteers/${reg.user.id}`}
                              className="block truncate text-body font-medium text-foreground transition-colors hover:text-primary-700"
                            >
                              {reg.user.name}
                            </Link>
                            <span className="block truncate text-caption text-muted-foreground">
                              {reg.user.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {attended && (
                            <StatusPill tone="success">
                              <UserCheck size={13} strokeWidth={2} />
                              Attended
                            </StatusPill>
                          )}
                          <Button
                            variant={attended ? 'ghost' : 'secondary'}
                            size="sm"
                            disabled={busy}
                            onClick={() => mark.mutate({ userId: reg.user.id, attended })}
                            className={
                              attended
                                ? 'text-destructive hover:bg-destructive-subtle hover:text-destructive'
                                : undefined
                            }
                          >
                            {busy ? (
                              'Working…'
                            ) : attended ? (
                              <>
                                <UserMinus strokeWidth={1.75} />
                                Undo
                              </>
                            ) : (
                              <>
                                <UserCheck strokeWidth={1.75} />
                                Mark present
                              </>
                            )}
                          </Button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {data.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-body text-muted-foreground">
                  {data.description}
                </p>
              </CardContent>
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
                  <CalendarDays size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="text-foreground">
                      {formatEventDate(data.date)}
                      {past && <StatusPill tone="neutral" className="ml-2">Past</StatusPill>}
                    </dd>
                  </div>
                </div>
                {formatEventTime(data.startTime, data.endTime) && (
                  <div className="flex gap-3">
                    <Clock size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <dt className="text-muted-foreground">Time</dt>
                      <dd className="text-foreground">
                        {formatEventTime(data.startTime, data.endTime)}
                      </dd>
                    </div>
                  </div>
                )}
                {data.location && (
                  <div className="flex gap-3">
                    <MapPin size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted-foreground" />
                    <div>
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="text-foreground">{data.location}</dd>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <Icon size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="text-foreground">{type.label}</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-surface-sunken p-3">
                  <p className="text-caption text-muted-foreground">Registered</p>
                  <p className="stat-value text-h2 text-foreground">
                    {data._count.registrations}
                  </p>
                </div>
                <div className="rounded-md bg-surface-sunken p-3">
                  <p className="text-caption text-muted-foreground">Attended</p>
                  <p className="stat-value text-h2 text-foreground">
                    {data._count.attendances}
                  </p>
                </div>
              </div>
              {/* Zero registrations previously produced NaN% here. */}
              <ProgressMeter
                value={data._count.attendances}
                max={data._count.registrations}
                label="Turnout"
                emptyLabel="No registrations yet"
              />
              {data.expectedVolunteers != null && (
                <p className="text-caption text-muted-foreground">
                  Target: {data.expectedVolunteers} volunteers
                </p>
              )}
            </CardContent>
          </Card>

          {data.creator && (
            <Card>
              <CardHeader>
                <CardTitle>Created by</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-foreground">{data.creator.name}</p>
                <p className="text-caption text-muted-foreground">{data.creator.email}</p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </>
  )
}

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <AuthGuard requiredRole="ADMIN">
      <DetailBody id={id} />
    </AuthGuard>
  )
}
