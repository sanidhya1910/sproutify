'use client'

import AnimatedList from '@/components/react-bits/animated-list'
import { useReducedMotion } from 'motion/react'
import { TextStamp } from './Stamp'
import { IconCrew, IconScan } from './icons'

/**
 * What a host sees on event day: arrivals landing as volunteers scan the QR
 * at the meeting point. The host name is the real demo host account
 * (lib/demo.ts); the arrivals are sample rows and are labelled as such.
 */

// The first three are on screen at mount (newest first); the rest arrive
// one by one at the top, so the clock only ever moves forward.
const ARRIVALS = [
  { name: 'Fatima S.', time: '07:05', first: false },
  { name: 'Rohan M.', time: '07:04', first: false },
  { name: 'Ananya K.', time: '07:02', first: true },
  { name: 'Aditya P.', time: '07:09', first: true },
  { name: 'Neha D.', time: '07:11', first: false },
  { name: 'Kabir J.', time: '07:12', first: false },
  { name: 'Sara F.', time: '07:14', first: true },
  { name: 'Imran Q.', time: '07:15', first: false },
  { name: 'Priya N.', time: '07:17', first: false },
  { name: 'Vikram T.', time: '07:18', first: true },
]

function Row({ name, time, first }: { name: string; time: string; first: boolean }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
  return (
    <div className="flex items-center gap-3 rounded-xl border border-background/10 bg-background/[0.06] px-3 py-2.5">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary-200 text-xs font-bold text-primary-900">
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-background">{name}</span>
        <span className="block font-mono text-[0.68rem] text-background/60">
          scanned in {time}
          {first && ' · first event'}
        </span>
      </span>
      <span className="rounded-md border border-primary-300/40 px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-primary-200">
        +20
      </span>
    </div>
  )
}

const ITEMS = ARRIVALS.map((a, i) => ({ id: i, content: <Row {...a} /> }))

export function HostConsole() {
  const reduced = useReducedMotion()

  return (
    <div className="relative rounded-[22px] border border-background/15 bg-primary-800 p-4 shadow-overlay sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-primary-200">
            Mumbai Beach Warriors · host view
          </p>
          <p className="mt-1 text-lg font-bold leading-tight text-background">Juhu Beach Cleanup</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-stamp px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white">
          <span className="size-1.5 animate-pulse rounded-full bg-white" />
          Live
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-background/[0.06] p-3">
          <p className="flex items-center gap-1.5 text-[0.7rem] text-primary-200">
            <IconCrew size={16} /> Registered
          </p>
          <p className="mt-1 font-mono text-xl font-semibold text-background">40</p>
        </div>
        <div className="rounded-xl bg-background/[0.06] p-3">
          <p className="flex items-center gap-1.5 text-[0.7rem] text-primary-200">
            <IconScan size={16} /> Scanned in
          </p>
          <p className="mt-1 font-mono text-xl font-semibold text-background">27</p>
        </div>
      </div>

      <div className="mt-3">
        <AnimatedList
          items={ITEMS}
          autoAddDelay={reduced ? 0 : 2200}
          maxItems={4}
          initialCount={3}
          startFrom="top"
          animationType="slide"
          enterFrom="top"
          fadeEdges
          fadeEdgeSize={60}
          fadeColor="hsl(var(--primary-800))"
          itemGap={8}
          height="290px"
          unstyled
          renderItem={(item) => item.content}
        />
      </div>

      <div className="pointer-events-none absolute -bottom-5 -right-3">
        <TextStamp text="Sample data" ink="orange" rotate={-8} className="bg-surface/90" />
      </div>
    </div>
  )
}
