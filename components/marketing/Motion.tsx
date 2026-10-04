'use client'

import { useInView } from 'react-intersection-observer'
import NumberFlow from '@number-flow/react'
import { RevealWords } from '@/components/motion/reveal-words'
import { cn } from '@/lib/utils'

/**
 * Thin client wrappers that pin motion components to Sproutify's motion
 * language: short, physical, and gone under prefers-reduced-motion. Pages
 * stay server components and import from here.
 */

const quartOut = (t: number) => 1 - Math.pow(1 - t, 4)

/**
 * Line-by-line headline that drops in like type being set. Each line is its
 * own block, so pass the lines separately.
 */
export function RevealText({
  text,
  className,
  startDelay = 0,
}: {
  text: string
  className?: string
  startDelay?: number
}) {
  return (
    <RevealWords
      text={text}
      className={className}
      stagger={0.07}
      startDelay={startDelay}
      duration={0.7}
      ease={quartOut}
    />
  )
}

/** Figure that counts up once, the first time it scrolls into view. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.6 })
  return (
    <span ref={ref} className={cn('tnum', className)}>
      <NumberFlow
        value={inView ? value : 0}
        format={{ notation: 'standard', maximumFractionDigits: 0 }}
        transformTiming={{ duration: 1200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        spinTiming={{ duration: 1200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </span>
  )
}
