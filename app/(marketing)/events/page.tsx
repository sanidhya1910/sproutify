'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarX2, Search } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { PageHeader } from '@/components/patterns/PageHeader'
import { EmptyState } from '@/components/patterns/EmptyState'
import { EventCard, type EventCardEvent } from '@/components/events/EventCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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

/**
 * Rebuilt from a page that never called an API: it set a hardcoded
 * `demoEvents` array inside a useEffect, printed
 * `Math.floor(Math.random()*30)+10` as the volunteer count (a new number on
 * every render), and rendered `{event.time}` — a field that did not exist —
 * leaving a dangling "at" after every date.
 */
export default function EventsPage() {
  const [scope, setScope] = useState<'upcoming' | 'past'>('upcoming')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['public-events', scope],
    queryFn: () => apiGet<EventCardEvent[]>(`/api/public/events?scope=${scope}`, false),
  })

  const events = useMemo(() => {
    let list = data ?? []
    if (type !== 'all') {
      list = list.filter((e) => resolveEventType(e).id === type)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)
      )
    }
    return list
  }, [data, type, search])

  const filtered = type !== 'all' || search.trim().length > 0

  return (
    <Container className="py-12 md:py-16">
      <PageHeader
        eyebrow="Get involved"
        title="Environmental events"
        description="Join an organised cleanup, plantation or restoration project near you. Every event is run with a local partner."
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              className="pl-9 sm:w-56"
              aria-label="Search events"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="sm:w-48" aria-label="Filter by type">
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
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={CalendarX2}
            title="Couldn't load events"
            description="Something went wrong reaching the server. This isn't a problem with your connection to the page itself."
            action={
              <Button onClick={() => refetch()} variant="secondary">
                Try again
              </Button>
            }
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title={filtered ? 'No events match those filters' : `No ${scope} events yet`}
            description={
              filtered
                ? 'Try clearing the search or choosing a different category.'
                : scope === 'upcoming'
                  ? 'Nothing is scheduled right now. Check back soon, or get in touch about hosting one.'
                  : 'Past events will appear here once the first one wraps up.'
            }
            action={
              filtered ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch('')
                    setType('all')
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} href={`/events/${event.id}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
