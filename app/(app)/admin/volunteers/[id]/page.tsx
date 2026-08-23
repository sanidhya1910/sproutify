'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Users, Mail, ShieldCheck, CalendarDays, Leaf } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatCard } from '@/components/patterns/StatCard'
import { StatusPill } from '@/components/patterns/StatusPill'
import { ProgressMeter } from '@/components/patterns/ProgressMeter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import { apiGet, apiPatch } from '@/lib/api'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDateShort, formatRelative } from '@/lib/format'

interface VolunteerDetail {
  id: string
  name: string
  email: string
  role: string
  ecoTokens?: number
  createdAt: string
  stats: { registeredEvents: number; attendedEvents: number }
  registrations: Array<{
    createdAt: string
    event: {
      id: string
      title: string
      location: string | null
      date: string
      type?: string | null
    }
  }>
  attendances: Array<{ event: { id: string } }>
}

function DetailBody({ id }: { id: string }) {
  const queryClient = useQueryClient()
  const [confirmPromote, setConfirmPromote] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-volunteer', id],
    queryFn: () => apiGet<VolunteerDetail>(`/api/admin/volunteers/${id}`),
  })

  const promote = useMutation({
    mutationFn: () => apiPatch(`/api/admin/volunteers/${id}`, { role: 'ADMIN' }),
    onSuccess: (res: unknown) => {
      toast.success((res as { message?: string })?.message || 'Promoted to admin')
      queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-volunteer', id] })
    },
    onError: (e: Error) => toast.error(e.message || 'Could not change this role'),
    onSettled: () => setConfirmPromote(false),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={Users}
        title="Couldn't load this volunteer"
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  const attendedIds = new Set(data.attendances.map((a) => a.event.id))

  return (
    <>
      <Link
        href="/admin/volunteers"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        All volunteers
      </Link>

      <div className="mt-5">
        <PageHeader
          eyebrow={data.role === 'ADMIN' ? 'Admin' : 'Volunteer'}
          title={data.name}
          description={data.email}
          actions={
            data.role === 'ADMIN' ? (
              <StatusPill tone="primary">
                <ShieldCheck size={13} strokeWidth={2} />
                Admin
              </StatusPill>
            ) : (
              /* Previously an inline two-step text confirm for a privilege
                 escalation. Now a proper dialog. */
              <Button variant="secondary" onClick={() => setConfirmPromote(true)}>
                <ShieldCheck strokeWidth={1.75} />
                Promote to admin
              </Button>
            )
          }
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Events registered"
          value={data.stats.registeredEvents}
          icon={CalendarDays}
        />
        <StatCard label="Events attended" value={data.stats.attendedEvents} icon={Users} />
        <StatCard label="EcoTokens" value={data.ecoTokens ?? 0} icon={Leaf} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Event history</CardTitle>
          </CardHeader>
          <CardContent>
            {data.registrations.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No registrations yet"
                className="border-0 px-0 py-8"
              />
            ) : (
              <ul className="divide-y divide-border">
                {data.registrations.map((reg) => {
                  const type = resolveEventType(reg.event)
                  const Icon = type.icon
                  const attended = attendedIds.has(reg.event.id)
                  return (
                    <li
                      key={reg.event.id}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                          <Icon size={15} strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/events/${reg.event.id}`}
                            className="block truncate text-body-sm font-medium text-foreground transition-colors hover:text-primary-700"
                          >
                            {reg.event.title}
                          </Link>
                          <span className="block truncate text-caption text-muted-foreground">
                            {formatEventDateShort(reg.event.date)}
                            {reg.event.location && ` · ${reg.event.location}`}
                          </span>
                        </div>
                      </div>
                      {attended ? (
                        <StatusPill tone="success">Attended</StatusPill>
                      ) : (
                        <StatusPill tone="neutral">Registered</StatusPill>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Turnout</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressMeter
                value={data.stats.attendedEvents}
                max={data.stats.registeredEvents}
                label="Attended vs registered"
                emptyLabel="No registrations yet"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-body-sm">
                <div className="flex gap-3">
                  <Mail size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="truncate text-foreground">{data.email}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CalendarDays size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Joined</dt>
                    <dd className="text-foreground">{formatRelative(data.createdAt)}</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>

      <AlertDialog open={confirmPromote} onOpenChange={setConfirmPromote}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make {data.name} an admin?</AlertDialogTitle>
            <AlertDialogDescription>
              Admins can create and delete events, mark attendance, view every volunteer&apos;s
              details, and promote other admins. This cannot be undone from this screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={promote.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={promote.isPending}
              onClick={(e) => {
                e.preventDefault()
                promote.mutate()
              }}
            >
              {promote.isPending ? 'Promoting…' : 'Promote to admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function AdminVolunteerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return (
    <AuthGuard requiredRole="ADMIN">
      <DetailBody id={id} />
    </AuthGuard>
  )
}
