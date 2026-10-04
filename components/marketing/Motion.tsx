'use client'

import { useInView } from 'react-intersection-observer'
import NumberFlow from '@number-flow/react'
import StaggeredText from '@/components/react-bits/staggered-text'
import { cn } from '@/lib/utils'

/**
 * Thin client wrappers that pin React Bits components to Sproutify's motion
 * language: short, physical, and gone under prefers-reduced-motion. Pages
 * stay server components and import from here.
 */

// A function, not a cubic-bezier array: StaggeredText animates keyframes,
// where motion reads an array `ease` as one easing PER SEGMENT, so a bezier
// tuple there is invalid and stalls the shared frame loop for every motion
// component on the page.
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
    <StaggeredText
      as="span"
      text={text}
      segmentBy="words"
      direction="bottom"
      delay={70}
      startDelay={startDelay}
      duration={0.7}
      easing={quartOut}
      blur={false}
      className={className}
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
