'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Stamp } from './Stamp'
import {
  IconChip,
  IconPassport,
  IconSapling,
  IconShore,
  IconTicket,
  IconToken,
} from './icons'

/**
 * Hero visual: a page from a volunteer's passport.
 *
 * The data is the real demo volunteer account (lib/demo.ts: four events
 * attended, 80 EcoTokens), so what the page shows is exactly what signing in
 * as that account shows — no invented totals. Stamps press in one after
 * another, then the "+20" check-in toast lands.
 */

const STAMPS = [
  { top: 'Juhu Beach', bottom: '17 Aug 2026', icon: IconShore, ink: 'blue', rotate: -11, seed: 2, x: '4%', y: '2%' },
  { top: 'Aarey Colony', bottom: '30 Aug 2026', icon: IconSapling, ink: 'green', rotate: 7, seed: 5, x: '50%', y: '0%' },
  { top: 'Powai', bottom: '13 Sep 2026', icon: IconChip, ink: 'orange', rotate: -4, seed: 8, x: '14%', y: '47%' },
  { top: 'Juhu Beach', bottom: '27 Sep 2026', icon: IconShore, ink: 'blue', rotate: 13, seed: 13, x: '56%', y: '45%' },
] as const

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-subtle-foreground">
        {label}
      </dt>
      <dd className={mono ? 'font-mono text-sm font-semibold' : 'text-sm font-semibold leading-tight'}>
        {value}
      </dd>
    </div>
  )
}

export function PassportPage() {
  const reduced = useReducedMotion()
  // The demo volunteer account (sanidhya.ravi@example.com in lib/demo.ts).
  const name = 'Sanidhya Ravi'
  const initials = 'SR'

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      {/* The page */}
      <div className="guilloche relative rotate-[-2deg] rounded-[18px] border border-primary-900/15 bg-surface p-5 shadow-overlay sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-primary-900/15 pb-4">
          <div className="flex items-center gap-2.5 text-primary-700">
            <IconPassport size={26} />
            <div>
              <p className="font-display text-[0.8rem] leading-none tracking-[0.06em]">Volunteer passport</p>
              <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-subtle-foreground">
                Field record · Mumbai
              </p>
            </div>
          </div>
          <p className="whitespace-nowrap font-mono text-[0.7rem] font-semibold tracking-[0.12em] text-stamp-ink">No. SPR-0412</p>
        </div>

        <div className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4">
          <div
            aria-hidden
            className="flex aspect-[4/5] items-center justify-center rounded-md border border-primary-900/15 bg-primary-100 font-display text-xl text-primary-700"
          >
            {initials}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-foreground">
            <Field label="Holder" value={name} />
            <Field label="Home base" value="Mumbai" />
            <Field label="Events" value="04" mono />
            <Field label="EcoTokens" value="080" mono />
          </dl>
        </div>

        {/* Stamp field */}
        <div className="relative mt-4 aspect-[1/0.92] rounded-xl border border-dashed border-primary-900/15">
          {STAMPS.map((s, i) => (
            <div key={i} className="absolute w-[44%]" style={{ left: s.x, top: s.y }}>
              <Stamp
                top={s.top}
                bottom={s.bottom}
                icon={s.icon}
                ink={s.ink}
                rotate={s.rotate}
                seed={s.seed}
                fluid
                animate
                delay={0.5 + i * 0.45}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Check-in toast */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: reduced ? 0 : 2.5, type: 'spring', stiffness: 380, damping: 26 }}
        className="absolute -left-4 bottom-10 flex items-center gap-3 rounded-2xl border border-primary-900/10 bg-foreground py-2.5 pl-2.5 pr-4 text-background shadow-overlay sm:-left-10"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-stamp text-white">
          <IconToken size={24} />
        </span>
        <span>
          <span className="block font-mono text-sm font-semibold">+20 EcoTokens</span>
          <span className="block text-xs text-background/70">Checked in · Juhu Beach</span>
        </span>
      </motion.div>

      {/* Next-up ticket */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: 16, rotate: 6 }}
        animate={{ opacity: 1, x: 0, rotate: 4 }}
        transition={{ delay: reduced ? 0 : 2.9, type: 'spring', stiffness: 300, damping: 24 }}
        className="absolute -right-3 -top-6 hidden items-center gap-2.5 rounded-xl border border-primary-900/10 bg-surface px-3 py-2 shadow-lg sm:flex md:-right-8"
      >
        <IconTicket size={22} className="text-stamp" />
        <span>
          <span className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-subtle-foreground">
            Next up
          </span>
          <span className="block text-xs font-semibold">Tree plantation · Aarey</span>
        </span>
      </motion.div>
    </div>
  )
}
