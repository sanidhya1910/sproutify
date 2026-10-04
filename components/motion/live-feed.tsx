'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

export interface LiveFeedItem {
  id: string | number
  content: ReactNode
}

/**
 * A short list that new rows drop into from the top, oldest rows falling off
 * the bottom. `items` is the script: the first `initialCount` are shown at
 * mount, then one more arrives every `intervalMs`, looping when it runs out.
 * With intervalMs 0 (or reduced motion) the list stays static.
 */
export function LiveFeed({
  items,
  initialCount = 3,
  maxItems = 4,
  intervalMs = 2200,
  gap = 8,
  height,
  className,
}: {
  items: LiveFeedItem[]
  initialCount?: number
  maxItems?: number
  intervalMs?: number
  gap?: number
  height?: number | string
  className?: string
}) {
  const reduced = useReducedMotion()
  const [rows, setRows] = useState(() =>
    items.slice(0, initialCount).map((item) => ({ key: `seed-${item.id}`, item }))
  )
  const cursor = useRef(initialCount)
  const serial = useRef(0)

  useEffect(() => {
    if (reduced || !intervalMs || items.length === 0) return
    const timer = setInterval(() => {
      const item = items[cursor.current % items.length]
      cursor.current += 1
      serial.current += 1
      setRows((prev) =>
        [{ key: `${item.id}-${serial.current}`, item }, ...prev].slice(0, maxItems)
      )
    }, intervalMs)
    return () => clearInterval(timer)
  }, [items, intervalMs, maxItems, reduced])

  return (
    <div
      className={className}
      style={{
        height,
        overflow: 'hidden',
        WebkitMaskImage:
          'linear-gradient(to bottom, #000 calc(100% - 60px), transparent)',
        maskImage: 'linear-gradient(to bottom, #000 calc(100% - 60px), transparent)',
      }}
    >
      <ul className="flex flex-col" style={{ gap }}>
        <AnimatePresence initial={false}>
          {rows.map(({ key, item }) => (
            <motion.li
              key={key}
              layout="position"
              initial={reduced ? false : { opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {item.content}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
