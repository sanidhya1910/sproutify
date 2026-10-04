'use client'

import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { AppIcon } from './icons'

export type StampInk = 'green' | 'orange' | 'blue' | 'ink' | 'paper'

const INKS: Record<StampInk, string> = {
  green: 'hsl(var(--primary-600))',
  orange: 'hsl(var(--stamp))',
  blue: 'hsl(218 55% 38%)',
  ink: 'hsl(var(--foreground))',
  /** For stamps pressed onto dark or orange panels. */
  paper: 'hsl(var(--surface))',
}

interface StampBaseProps {
  ink?: StampInk
  /** Resting rotation in degrees. Real stamps are never square to the page. */
  rotate?: number
  size?: number
  className?: string
  /** Play the "thud" when it scrolls into view. */
  animate?: boolean
  /** Seconds before the thud, for sequencing several stamps. */
  delay?: number
  /** Noise seed, so neighbouring stamps don't wear identically. */
  seed?: number
  /** Fill the parent's width (square) instead of a fixed pixel size. */
  fluid?: boolean
}

/**
 * Worn-ink filter: fractal noise eats small holes out of the artwork and a
 * slight displacement roughens the edges, the way a rubber stamp prints
 * unevenly on fibrous paper.
 */
function InkFilter({ id, seed }: { id: string; seed: number }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} result="noise" />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.62"
        result="holes"
      />
      <feComposite in="SourceGraphic" in2="holes" operator="in" result="worn" />
      <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="1" seed={seed + 7} result="warp" />
      <feDisplacementMap in="worn" in2="warp" scale="2.2" />
    </filter>
  )
}

function Thud({
  animate,
  rotate,
  delay,
  className,
  size,
  fluid,
  label,
  children,
}: {
  animate: boolean
  rotate: number
  delay: number
  className?: string
  size: number
  fluid?: boolean
  label: string
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()
  const style = fluid ? { width: '100%', aspectRatio: '1' } : { width: size, height: size }

  if (!animate || reduced) {
    return (
      <div role="img" aria-label={label} className={className} style={{ ...style, rotate: `${rotate}deg` }}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      role="img"
      aria-label={label}
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 1.55, rotate: rotate - 10 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: 'spring', stiffness: 520, damping: 24, mass: 0.8, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Round passport stamp: double ring, a place along the top, a date or
 * category along the bottom, and an activity icon in the middle.
 */
export function Stamp({
  top,
  bottom,
  icon: Icon,
  ink = 'green',
  rotate = -8,
  size = 132,
  className,
  animate = false,
  delay = 0,
  seed = 3,
  fluid = false,
}: StampBaseProps & {
  top: string
  bottom?: string
  icon: AppIcon
}) {
  const uid = useId().replace(/:/g, '')
  const color = INKS[ink]
  // The top arc is ~185 units long; shrink long place names to fit it
  // rather than letting them run off the ends.
  const topSize = Math.min(21, 168 / (top.length * 0.8))
  const bottomSize = bottom ? Math.min(15, 150 / (bottom.length * 0.62)) : 15

  return (
    <Thud
      animate={animate}
      rotate={rotate}
      delay={delay}
      size={size}
      fluid={fluid}
      label={[top, bottom].filter(Boolean).join(', ')}
      className={cn('shrink-0', className)}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" style={{ color }}>
        <defs>
          <InkFilter id={`ink-${uid}`} seed={seed} />
          <path id={`top-${uid}`} d="M 41 100 A 59 59 0 0 1 159 100" />
          <path id={`bot-${uid}`} d="M 34 100 A 66 66 0 0 0 166 100" />
        </defs>
        <g filter={`url(#ink-${uid})`} fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="92" strokeWidth="7.5" />
          <circle cx="100" cy="100" r="80" strokeWidth="2.6" />
          <circle cx="100" cy="100" r="45" strokeWidth="2.6" />
          <text
            fill="currentColor"
            stroke="none"
            fontFamily="var(--font-archivo)"
            fontWeight="900"
            fontSize={topSize}
            letterSpacing={topSize * 0.09}
            style={{ fontVariationSettings: "'wdth' 112" }}
          >
            <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">
              {top.toUpperCase()}
            </textPath>
          </text>
          {bottom && (
            <text
              fill="currentColor"
              stroke="none"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              fontSize={bottomSize}
              letterSpacing={bottomSize * 0.1}
            >
              <textPath href={`#bot-${uid}`} startOffset="50%" textAnchor="middle">
                {bottom.toUpperCase()}
              </textPath>
            </text>
          )}
          <circle cx="23" cy="100" r="3.2" fill="currentColor" stroke="none" />
          <circle cx="177" cy="100" r="3.2" fill="currentColor" stroke="none" />
          <Icon size={64} x={68} y={68} strokeWidth={2.6} overflow="visible" />
        </g>
      </svg>
    </Thud>
  )
}

/**
 * Rectangular text stamp ("CHECKED IN", "TARGET", "SAMPLE"). Double border,
 * one line of heavy text, optional mono line under it.
 */
export function TextStamp({
  text,
  sub,
  ink = 'orange',
  rotate = -6,
  className,
  animate = false,
  delay = 0,
  seed = 11,
}: Omit<StampBaseProps, 'size'> & { text: string; sub?: string }) {
  const uid = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const color = INKS[ink]

  const body = (
    <span className="relative inline-flex">
      <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <InkFilter id={`tink-${uid}`} seed={seed} />
        </defs>
        <g filter={`url(#tink-${uid})`} fill="none" stroke={color}>
          <rect
            x="1.5"
            y="1.5"
            rx="7"
            strokeWidth="3.5"
            style={{ width: 'calc(100% - 3px)', height: 'calc(100% - 3px)' }}
          />
          <rect
            x="6"
            y="6"
            rx="4"
            strokeWidth="1.2"
            style={{ width: 'calc(100% - 12px)', height: 'calc(100% - 12px)' }}
          />
        </g>
      </svg>
      <span
        className="relative flex flex-col items-center px-4 py-2.5 text-center"
        style={{ color, filter: `url(#tink-${uid})` }}
      >
        <span className="font-display text-[1.05rem] leading-none tracking-[0.04em]">{text}</span>
        {sub && (
          <span className="mt-1 font-mono text-[0.625rem] font-semibold uppercase leading-none tracking-[0.18em]">
            {sub}
          </span>
        )}
      </span>
    </span>
  )

  if (!animate || reduced) {
    return (
      <span className={cn('inline-block', className)} style={{ rotate: `${rotate}deg` }}>
        {body}
      </span>
    )
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      initial={{ opacity: 0, scale: 1.6, rotate: rotate - 8 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ type: 'spring', stiffness: 520, damping: 24, mass: 0.8, delay }}
    >
      {body}
    </motion.span>
  )
}
