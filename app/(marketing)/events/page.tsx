'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarX2, Search } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { IconTicket } from '@/components/passport/icons'
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
    // One retry, not the app-wide two: a visitor staring at skeletons for
    // several seconds of exponential backoff reads as a hung page.
    retry: 1,
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
    <>
      <MarketingHeader
        label="Events"
        icon={IconTicket}
        lines={['Find your']}
        accent="next stamp."
        description="Organised cleanups, plantations and restoration projects near you. Every event is run with a local partner, a safety briefing and supplied equipment."
        className="pb-8 md:pb-10"
      />
      <Container className="pb-section md:pb-section-lg">
        <div className="sticky top-16 z-20 -mx-5 flex flex-col gap-3 border-b-2 border-dashed border-primary-900/15 bg-background/90 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between md:-mx-8 md:px-8">
          <Tabs value={scope} onValueChange={(v) => setScope(v as 'upcoming' | 'past')}>
            <TabsList className="h-11 rounded-full border border-primary-900/12 bg-surface p-1">
              <TabsTrigger
                value="upcoming"
                className="h-9 rounded-full px-4 font-semibold data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="h-9 rounded-full px-4 font-semibold data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Past
              </TabsTrigger>
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
                placeholder="Search by name or place"
                className="h-11 rounded-full bg-surface pl-9 sm:w-64"
                aria-label="Search events"
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-11 rounded-full bg-surface sm:w-48" aria-label="Filter by type">
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
                <Skeleton key={i} className="h-[440px] rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon={CalendarX2}
              title="Events are temporarily unavailable"
              description="We couldn't reach the events service just now. It's not your connection — please try again in a moment."
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
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} href={`/events/${event.id}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  )
}
