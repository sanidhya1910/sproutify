'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CalendarX2, Search, Check } from 'lucide-react'
import AuthGuard from '@/components/auth/auth-guard'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { EventCard, type EventCardEvent } from '@/components/events/EventCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EVENT_TYPE_LIST, resolveEventType } from '@/lib/event-types'
import { apiGet } from '@/lib/api'
import { useEffectiveRegistrations } from '@/lib/use-effective-registrations'
import { isEventPast } from '@/lib/format'

/**
 * Rebuilt from a 696-line MUI page. The type filter here is the one that has
 * never worked: it filtered on `event.type`, which did not exist in the
 * schema until Phase 2, so selecting any category returned an empty list.
 *
 * Errors also went through native alert(); they now use toasts.
 */

function EventsBody() {
  const [scope, setScope] = useState<'upcoming' | 'past'>('upcoming')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [onlyRegistered, setOnlyRegistered] = useState(false)

  const eventsQuery = useQuery({
    queryKey: ['volunteer-events'],
    queryFn: () => apiGet<EventCardEvent[]>('/api/volunteer/events'),
  })

  // Registering/cancelling here is session-only — see lib/local-overrides.ts.
  const { isRegistered, register, unregister } = useEffectiveRegistrations()

  const events = useMemo(() => {
    let list = eventsQuery.data ?? []
    list = list.filter((e) => (scope === 'past' ? isEventPast(e.date) : !isEventPast(e.date)))
    if (type !== 'all') list = list.filter((e) => resolveEventType(e).id === type)
    if (onlyRegistered) list = list.filter((e) => isRegistered(e.id))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) => e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)
      )
    }
    return list
  }, [eventsQuery.data, scope, type, onlyRegistered, isRegistered, search])

  const filtered = type !== 'all' || onlyRegistered || search.trim().length > 0

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Browse events"
        description="Find something near you and register. You can cancel any time before the day."
      />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={scope} onValueChange={(v) => setScope(v as 'upcoming' | 'past')}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events"
              className="pl-9 sm:w-52"
              aria-label="Search events"
            />
          </div>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="sm:w-44" aria-label="Filter by type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {EVENT_TYPE_LIST.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Checkbox
              id="only-registered"
              checked={onlyRegistered}
              onCheckedChange={(v) => setOnlyRegistered(v === true)}
            />
            <Label htmlFor="only-registered" className="whitespace-nowrap font-normal">
              Only mine
            </Label>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {eventsQuery.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-lg" />
            ))}
          </div>
        ) : eventsQuery.isError ? (
          <EmptyState
            icon={CalendarX2}
            title="Couldn't load events"
            description="Something went wrong reaching the server."
            action={
              <Button variant="secondary" onClick={() => eventsQuery.refetch()}>
                Try again
              </Button>
            }
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title={filtered ? 'No events match those filters' : `No ${scope} events`}
            description={
              filtered
                ? 'Try clearing the search or choosing a different category.'
                : 'Nothing scheduled right now. Check back soon.'
            }
            action={
              filtered ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('')
                    setType('all')
                    setOnlyRegistered(false)
                  }}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <p className="mb-4 text-body-sm text-muted-foreground">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => {
                const registered = isRegistered(event.id)
                const past = isEventPast(event.date)

                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    href={`/volunteer/events/${event.id}`}
                    actions={
                      <div className="flex gap-2">
                        <Button asChild variant="secondary" size="sm" className="flex-1">
                          <a href={`/volunteer/events/${event.id}`}>Details</a>
                        </Button>
                        {past ? null : registered ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              unregister(event.id)
                              toast.success('Registration cancelled')
                            }}
                          >
                            <Check strokeWidth={2} />
                            Registered
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              register(event.id)
                              toast.success('You are registered for this event')
                            }}
                          >
                            Register
                          </Button>
                        )}
                      </div>
                    }
                  />
                )
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default function VolunteerEventsPage() {
  return (
    <AuthGuard requiredRole="VOLUNTEER">
      <EventsBody />
    </AuthGuard>
  )
}
