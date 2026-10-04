import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ArrowUpRight } from 'lucide-react'
import { AssetImage } from '@/components/patterns/AssetImage'
import { Stamp } from '@/components/passport/Stamp'
import { IconClock, IconPin } from '@/components/passport/icons'
import { resolveEventType } from '@/lib/event-types'
import { formatEventTime } from '@/lib/format'
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
 * Styled as an admission ticket: photo, details, then a perforated stub with
 * the date and how full the event is. The category is a small passport stamp
 * pressed over the photo's corner. With no `actions` the whole ticket is one
 * link (stretched title link); with actions, only the title links so the
 * buttons stay clickable.
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
  const needed = event.expectedVolunteers ?? 0
  const filled = needed > 0 ? Math.min(100, Math.round((registered / needed) * 100)) : 0
  const time = formatEventTime(event.startTime, event.endTime)
  const parsed = event.date ? parseISO(event.date) : null
  const date = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null
  const stretched = Boolean(href && !actions)

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl border border-primary-900/12 bg-surface shadow-sm transition-[transform,box-shadow] duration-500 ease-out',
        stretched && 'hover:-translate-y-1 hover:rotate-[-0.6deg] hover:shadow-lg',
        className
      )}
    >
      <div className="relative">
        <div className="overflow-hidden rounded-t-2xl">
          <AssetImage
            slot={type.artSlot as AssetId}
            icon={Icon}
            alt=""
            className="h-[176px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 380px, 100vw"
            override={event.imageUrl}
          />
        </div>
        <div className="pointer-events-none absolute -bottom-8 right-4 w-[84px] drop-shadow-sm">
          <div className="rounded-full bg-surface/90 p-1 backdrop-blur-sm">
            <Stamp
              top={type.label}
              bottom={date ? format(date, 'd MMM') : undefined}
              icon={Icon}
              ink={type.ink}
              rotate={-10}
              seed={(event.id?.length ?? 3) + 4}
              fluid
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="flex items-center gap-1.5 pr-24 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-primary-600">
          <Icon size={15} />
          {type.label}
        </p>
        <h3 className="mt-2 text-[1.15rem] font-bold leading-snug tracking-[-0.01em] text-foreground">
          {href ? (
            <Link
              href={href}
              className={cn(
                'transition-colors hover:text-primary-700 focus-visible:outline-none',
                stretched &&
                  'after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring'
              )}
            >
              {event.title}
            </Link>
          ) : (
            event.title
          )}
        </h3>

        <dl className="mt-3 space-y-1.5 text-body-sm text-muted-foreground">
          {event.location && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Where</dt>
              <IconPin size={16} className="shrink-0 text-primary-600" />
              <dd className="truncate">{event.location}</dd>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Time</dt>
              <IconClock size={16} className="shrink-0 text-primary-600" />
              <dd className="font-mono text-[0.8rem]">{time}</dd>
            </div>
          )}
        </dl>

        {event.description && (
          <p className="mt-3 line-clamp-2 text-body-sm text-muted-foreground">{event.description}</p>
        )}
      </div>

      {/* Perforation, with notches punched out of each edge. The notches are
          painted in --ticket-bg (the page colour by default); a container
          with a different background sets that variable. */}
      <div aria-hidden className="relative mx-4 border-t-2 border-dashed border-primary-900/15">
        <span className="absolute -left-[27px] -top-[11px] size-5 rounded-full border border-primary-900/12 bg-[var(--ticket-bg,hsl(var(--background)))] [clip-path:inset(0_0_0_50%)]" />
        <span className="absolute -right-[27px] -top-[11px] size-5 rounded-full border border-primary-900/12 bg-[var(--ticket-bg,hsl(var(--background)))] [clip-path:inset(0_50%_0_0)]" />
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-subtle-foreground">
              {date ? format(date, 'EEEE') : 'Date'}
            </p>
            <p className="font-display text-[1.6rem] leading-none tracking-[-0.01em] text-foreground">
              {date ? format(date, 'd MMM') : 'TBC'}
            </p>
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className="font-mono text-[0.72rem] text-muted-foreground">
              <span className="font-semibold text-foreground">{registered}</span>
              {needed ? ` / ${needed}` : ''} volunteers
            </p>
            {needed > 0 && (
              <div className="ml-auto mt-1.5 h-1.5 max-w-[9rem] overflow-hidden rounded-full bg-surface-sunken" aria-hidden>
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${filled}%` }} />
              </div>
            )}
          </div>
          {stretched && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
            </span>
          )}
        </div>
        {actions && <div className="relative z-10 mt-4">{actions}</div>}
      </div>
    </article>
  )
}
