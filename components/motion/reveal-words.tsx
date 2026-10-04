'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Headline that sets word by word: each word rises out of a clipped line box.
 * Renders plain text under prefers-reduced-motion. The visual words are hidden
 * from assistive tech and the full string is exposed once via aria-label.
 */
export function RevealWords({
  text,
  className,
  stagger = 0.07,
  startDelay = 0,
  duration = 0.7,
  ease = (t: number) => 1 - Math.pow(1 - t, 4),
}: {
  text: string
  className?: string
  /** Seconds between consecutive words. */
  stagger?: number
  /** Seconds before the first word starts. */
  startDelay?: number
  duration?: number
  /** Function easing (0..1 -> 0..1). */
  ease?: (t: number) => number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <span className={className}>{text}</span>

  const words = text.split(/\s+/).filter(Boolean)
  return (
    <span className={cn('inline', className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration, ease, delay: startDelay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
