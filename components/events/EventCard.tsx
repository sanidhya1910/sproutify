import Link from 'next/link'
import { MapPin, Users, CalendarDays } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/patterns/StatusPill'
import { AssetImage } from '@/components/patterns/AssetImage'
import { resolveEventType } from '@/lib/event-types'
import { formatEventDateShort, formatEventTime } from '@/lib/format'
import type { AssetId } from '@/lib/assets'
import { cn } from '@/lib/utils'

export interface EventCardEvent {
  id: string
  title: string
  description?: string | null
  location?: string | null
  date?: string | null
  startTime?: string | null
  endTime?: string | null
  type?: string | null
  imageUrl?: string | null
  expectedVolunteers?: number | null
  safetyInstructions?: string | null
  _count?: { registrations?: number } | null
}

/**
 * One event card for every surface (public, volunteer, admin), replacing
 * three separately hand-rolled implementations that shared no code.
 *
 * The media slot used to be a green gradient with a 4rem emoji picked by
 * keyword-matching the title. It now renders real category artwork through
 * the asset manifest, falling back to a vector icon — never an emoji — while
 * those assets are still pending.
 */
export function EventCard({
  event,
  href,
  actions,
  className,
}: {
  event: EventCardEvent
  href?: string
  /** Footer controls, e.g. register/unregister or admin edit/delete. */
  actions?: React.ReactNode
  className?: string
}) {
  const type = resolveEventType(event)
  const Icon = type.icon
  const registered = event._count?.registrations ?? 0
  const time = formatEventTime(event.startTime, event.endTime)

  return (
    <Card variant="interactive" className={cn('flex flex-col overflow-hidden', className)}>
      <div className="relative border-b border-border">
        <AssetImage
          slot={type.artSlot as AssetId}
          icon={Icon}
          alt=""
          className="h-[168px] object-cover"
          sizes="(min-width: 1024px) 380px, 100vw"
          override={event.imageUrl}
        />
        <div className="absolute left-3 top-3">
          <StatusPill tone={type.tone} className="bg-surface/90 backdrop-blur">
            <Icon size={13} strokeWidth={2} />
            {type.label}
          </StatusPill>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-h4 text-foreground">
          {href ? (
            <Link href={href} className="transition-colors hover:text-primary-700">
              {event.title}
            </Link>
          ) : (
            event.title
          )}
        </h3>

        <dl className="mt-3 space-y-1.5 text-body-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <dt className="sr-only">When</dt>
            <CalendarDays size={15} strokeWidth={1.75} className="shrink-0" />
            <dd>
              {formatEventDateShort(event.date)}
              {time && <span className="text-subtle-foreground"> · {time}</span>}
            </dd>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Where</dt>
              <MapPin size={15} strokeWidth={1.75} className="shrink-0" />
              <dd className="truncate">{event.location}</dd>
            </div>
          )}
          <div className="flex items-center gap-2">
            <dt className="sr-only">Volunteers</dt>
            <Users size={15} strokeWidth={1.75} className="shrink-0" />
            <dd className="tnum">
              {registered} registered
              {event.expectedVolunteers ? ` of ${event.expectedVolunteers} needed` : ''}
            </dd>
          </div>
        </dl>

        {event.description && (
          <p className="mt-3 line-clamp-2 text-body-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          {actions ?? (
            href && (
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link href={href}>View details</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </Card>
  )
}
