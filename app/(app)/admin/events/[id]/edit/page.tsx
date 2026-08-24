'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarX2 } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { EventForm, type EventFormValues } from '@/components/events/EventForm'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiGet } from '@/lib/api'

interface AdminEvent {
  id: string
  title: string
  description: string
  location: string
  date: string
  startTime: string
  endTime: string
  type?: string | null
  expectedVolunteers?: number | null
  safetyInstructions?: string | null
  isFeatured?: boolean
  imageUrl?: string | null
}

function EditBody({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-event', id],
    queryFn: () => apiGet<AdminEvent>(`/api/admin/events/${id}`),
  })

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-72 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
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

  const initialValues: EventFormValues = {
    title: data.title ?? '',
    description: data.description ?? '',
    location: data.location ?? '',
    date: data.date ? data.date.slice(0, 10) : '',
    startTime: data.startTime ?? '',
    endTime: data.endTime ?? '',
    type: data.type ?? 'OTHER',
    expectedVolunteers: data.expectedVolunteers != null ? String(data.expectedVolunteers) : '',
    safetyInstructions: data.safetyInstructions ?? '',
    isFeatured: !!data.isFeatured,
    imageUrl: data.imageUrl ?? '',
  }

  return (
    <>
      <Link
        href={`/admin/events/${id}`}
        className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        Back to event
      </Link>

      <div className="mt-5 max-w-3xl">
        <PageHeader eyebrow="Events" title="Edit event" description={data.title} />
        <div className="mt-8">
          <EventForm
            mode="edit"
            eventId={id}
            initialValues={initialValues}
            cancelHref={`/admin/events/${id}`}
          />
        </div>
      </div>
    </>
  )
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <AuthGuard requiredRole={['ADMIN', 'ORGANIZER']}>
      <EditBody id={id} />
    </AuthGuard>
  )
}
