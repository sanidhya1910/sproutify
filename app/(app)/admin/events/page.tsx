'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, Search, CalendarX2, Eye, Pencil, QrCode, Trash2 } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { StatusPill } from '@/components/patterns/StatusPill'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
 * Rebuilt from a Tailwind page whose background was a grey-to-teal gradient
 * (unique to the three admin pages, clashing with the rest of the product),
 * whose copy said "beach cleanup events" though the platform supports several
 * categories, and whose four action buttons were four different colours.
 *
 * Delete moves from a hand-rolled fixed-overlay div to AlertDialog, so it has
 * a real focus trap and Esc handling.
 */

interface AdminEvent {
  id: string
  title: string
  location: string | null
  date: string
  startTime: string | null
  endTime: string | null
  type: string | null
  isFeatured: boolean
  _count: { registrations: number; attendances: number }
}

function EventsBody() {
  const queryClient = useQueryClient()
  const [scope, setScope] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [search, setSearch] = useState('')
  const [pendingDelete, setPendingDelete] = useState<AdminEvent | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => apiGet<AdminEvent[]>('/api/admin/events'),
  })

  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/admin/events/${id}`),
    onSuccess: () => {
      toast.success('Event deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-events'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
    onError: (e: Error) => toast.error(e.message || 'Could not delete this event'),
    onSettled: () => setPendingDelete(null),
  })

  const events = useMemo(() => {
    let list = data ?? []
    if (scope === 'upcoming') list = list.filter((e) => !isEventPast(e.date))
    else if (scope === 'past') list = list.filter((e) => isEventPast(e.date))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) => e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)
      )
    }
    return list
  }, [data, scope, search])

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Events"
        description="Create, edit and manage events across all categories."
        actions={
          <Button asChild>
            <Link href="/admin/events/create">
              <Plus strokeWidth={1.75} />
              New event
            </Link>
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={scope} onValueChange={(v) => setScope(v as typeof scope)}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location"
            className="pl-9 sm:w-72"
            aria-label="Search events"
          />
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-80 rounded-lg" />
        ) : isError ? (
          <EmptyState
            icon={CalendarX2}
            title="Couldn't load events"
            action={
              <Button variant="secondary" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title={search ? 'No events match that search' : `No ${scope} events`}
            action={
              search ? (
                <Button variant="secondary" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/admin/events/create">Create event</Link>
                </Button>
              )
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead className="text-right">Registered</TableHead>
                    <TableHead className="text-right">Attended</TableHead>
                    <TableHead className="w-px">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const type = resolveEventType(event)
                    const Icon = type.icon
                    const past = isEventPast(event.date)
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
                            {event.isFeatured && <StatusPill tone="info">Featured</StatusPill>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusPill tone={type.tone}>{type.label}</StatusPill>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatEventDateShort(event.date)}
                          <span className="block text-caption text-subtle-foreground">
                            {formatEventTime(event.startTime, event.endTime)}
                            {past && ' · past'}
                          </span>
                        </TableCell>
                        <TableCell className="tnum text-right">
                          {event._count.registrations}
                        </TableCell>
                        <TableCell className="tnum text-right">
                          {event._count.attendances}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button asChild variant="ghost" size="icon" title="View">
                              <Link href={`/admin/events/${event.id}`}>
                                <Eye strokeWidth={1.75} />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" title="Edit">
                              <Link href={`/admin/events/${event.id}/edit`}>
                                <Pencil strokeWidth={1.75} />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" title="QR code">
                              <Link href={`/admin/events/${event.id}/qr`}>
                                <QrCode strokeWidth={1.75} />
                                <span className="sr-only">QR code</span>
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              className="text-destructive hover:bg-destructive-subtle hover:text-destructive"
                              onClick={() => setPendingDelete(event)}
                            >
                              <Trash2 strokeWidth={1.75} />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{pendingDelete?.title}</span> and its{' '}
              {pendingDelete?._count.registrations ?? 0} registration(s) will be removed. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={remove.isPending}
              onClick={(e) => {
                e.preventDefault()
                if (pendingDelete) remove.mutate(pendingDelete.id)
              }}
            >
              {remove.isPending ? 'Deleting…' : 'Delete event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function AdminEventsPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <EventsBody />
    </AuthGuard>
  )
}
