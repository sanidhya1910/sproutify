import { cn } from '@/lib/utils'

/**
 * Two strips of packing tape crossing the page, carrying the work and the
 * places it happens (the seeded Mumbai events: Juhu, Aarey, Powai). Pure CSS
 * marquee; the global reduced-motion rule freezes it.
 */

const WORK = ['Beach cleanups', 'Juhu', 'Tree planting', 'Aarey', 'E-waste drives', 'Powai']

function Band({
  items,
  className,
  reverse,
  duration,
}: {
  items: string[]
  className?: string
  reverse?: boolean
  duration: string
}) {
  const run = (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {items.map((w, i) => (
        <span key={i} className="flex items-center gap-6">
          <span>{w}</span>
          <span aria-hidden className="text-[0.7em] opacity-70">
            ✦
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={cn('overflow-hidden whitespace-nowrap py-3 font-display text-xl sm:text-2xl', className)}>
      <div
        className={cn('flex w-max animate-marquee', reverse && '[animation-direction:reverse]')}
        style={{ ['--marquee-duration' as string]: duration }}
      >
        {run}
        {run}
        {run}
        {run}
      </div>
    </div>
  )
}

export function TapeStrip({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-[140px] overflow-hidden sm:h-[170px]', className)} aria-label={WORK.join(', ')} role="img">
      <Band
        items={WORK}
        duration="48s"
        reverse
        className="absolute inset-x-[-5%] top-[46%] rotate-[1.5deg] bg-primary-700 text-primary-100 opacity-95"
      />
      <Band
        items={WORK}
        duration="38s"
        className="absolute inset-x-[-5%] top-[14%] -rotate-[2deg] bg-stamp text-white shadow-lg"
      />
    </div>
  )
}
