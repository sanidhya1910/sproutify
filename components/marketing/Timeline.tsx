'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { TextStamp } from '@/components/passport/Stamp'

export interface Milestone {
  year: string
  title: string
  body: string
}

/**
 * Milestones as passport entries: each year is a small stamp on a dashed
 * rail, and a solid orange line draws down the rail as the reader scrolls,
 * acting as a progress indicator for the section.
 */
export function Timeline({ items }: { items: Milestone[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-6 left-[43px] top-6 border-l-2 border-dashed border-primary-900/20" />
      <motion.span
        aria-hidden
        style={{ scaleY }}
        className="absolute bottom-6 left-[42px] top-6 w-[3px] origin-top rounded-full bg-stamp"
      />
      {items.map((m, i) => (
        <li key={m.year} className="relative grid grid-cols-[88px_minmax(0,1fr)] gap-6 pb-12 last:pb-0">
          <div className="relative z-10 flex justify-center bg-background pt-1">
            <TextStamp text={m.year} ink={i % 2 ? 'green' : 'orange'} rotate={i % 2 ? 4 : -5} seed={i + 30} animate />
          </div>
          <div className="pt-1">
            <h3 className="text-h3 font-bold tracking-[-0.01em]">{m.title}</h3>
            <p className="mt-1.5 max-w-lg text-body-lg text-muted-foreground">{m.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
