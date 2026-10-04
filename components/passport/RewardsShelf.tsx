import Image from 'next/image'
import { cn } from '@/lib/utils'
import { IconToken } from './icons'

/**
 * The redeem shop, as it actually is: the three items seeded by
 * prisma/seed.js, at their seeded prices, with their real product photos.
 * The balance bar uses the demo volunteer's 80 tokens to show what that buys.
 */

const REWARDS = [
  { name: 'Plantable seed pencil', cost: 20, src: '/rewards/seed-pencil.png' },
  { name: 'Organic tote bag', cost: 40, src: '/rewards/tote-bag.png' },
  { name: 'Steel water bottle', cost: 50, src: '/rewards/water-bottle.png' },
] as const

const BALANCE = 80
const SCALE_MAX = 100

export function RewardsShelf({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      {/* Balance meter with each reward's price marked on it */}
      <div className="rounded-xl bg-foreground p-4 text-background">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <IconToken size={22} className="text-stamp" />
            Balance
          </span>
          <span className="font-mono text-lg font-semibold">{BALANCE}</span>
        </div>
        <div className="relative mt-3 h-2 rounded-full bg-background/15">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-stamp"
            style={{ width: `${(BALANCE / SCALE_MAX) * 100}%` }}
          />
          {REWARDS.map((r) => (
            <span
              key={r.name}
              className="absolute -top-1 h-4 w-0.5 rounded-full bg-background"
              style={{ left: `${(r.cost / SCALE_MAX) * 100}%` }}
            />
          ))}
        </div>
        <div className="relative mt-1.5 h-3 font-mono text-[0.6rem] text-background/60">
          {REWARDS.map((r) => (
            <span key={r.name} className="absolute -translate-x-1/2" style={{ left: `${(r.cost / SCALE_MAX) * 100}%` }}>
              {r.cost}
            </span>
          ))}
        </div>
      </div>

      <ul className={cn('mt-3 grid gap-3', compact ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3')}>
        {REWARDS.map((r) => {
          const affordable = r.cost <= BALANCE
          return (
            <li
              key={r.name}
              className="flex flex-col overflow-hidden rounded-xl border border-primary-900/10 bg-surface"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-sunken">
                <Image src={r.src} alt={r.name} width={240} height={240} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-1.5 p-2.5">
                <p className={cn('font-semibold leading-tight', compact ? 'text-[0.7rem]' : 'text-sm')}>{r.name}</p>
                <p className="flex items-center gap-1 font-mono text-[0.7rem] font-semibold">
                  <IconToken size={14} className="text-stamp" />
                  {r.cost}
                  {affordable && <span className="ml-auto text-primary-600">✓</span>}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
