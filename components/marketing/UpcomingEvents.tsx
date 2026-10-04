'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight } from 'lucide-react'
import { EventCard, type EventCardEvent } from '@/components/events/EventCard'
import { Container } from '@/components/patterns/Container'
import { Reveal } from '@/components/patterns/Reveal'
import { apiGet } from '@/lib/api'

/**
 * Live "what's next" strip. It renders nothing at all while loading, on
 * error, or when nothing is scheduled: a homepage section of skeletons or an
 * apology is worse than no section.
 */
export function UpcomingEvents() {
  const { data } = useQuery({
    queryKey: ['public-events', 'upcoming'],
    queryFn: () => apiGet<EventCardEvent[]>('/api/public/events?scope=upcoming', false),
    retry: 1,
  })

  const events = (data ?? []).slice(0, 3)
  if (events.length === 0) return null

  return (
    <section className="py-section md:py-section-lg">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-mega">Next up near you</h2>
          <Link
            href="/events"
            className="group inline-flex items-center gap-1.5 rounded-full border border-primary-900/15 bg-surface px-4 py-2 text-body font-semibold text-foreground transition-colors hover:border-primary-700"
          >
            All events
            <ArrowUpRight
              size={18}
              strokeWidth={1.75}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <Reveal key={event.id} delay={i * 90}>
              <EventCard event={event} href={`/events/${event.id}`} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
