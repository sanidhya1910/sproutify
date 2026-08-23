'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EventForm, EMPTY_EVENT } from '@/components/events/EventForm'

export default function CreateEventPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        All events
      </Link>

      <div className="mt-5 max-w-3xl">
        <PageHeader
          eyebrow="Events"
          title="Create event"
          description="Publish a new event for volunteers to register for."
        />
        <div className="mt-8">
          <EventForm mode="create" initialValues={EMPTY_EVENT} cancelHref="/admin/events" />
        </div>
      </div>
    </AuthGuard>
  )
}
