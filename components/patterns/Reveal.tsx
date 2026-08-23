'use client'

import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

/**
 * Replaces MUI's <Fade> and <Zoom> in a single primitive. No animation
 * library is added — `framer` in package.json was the Framer canvas runtime
 * (an install mistake) and was removed in Phase 0.
 *
 * Respects prefers-reduced-motion via the global rule in globals.css, which
 * collapses the animation duration to ~0.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '-40px 0px' })

  return (
    <div
      ref={ref}
      className={cn(inView && 'animate-fade-up', className)}
      style={inView && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
