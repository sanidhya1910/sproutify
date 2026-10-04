'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
// @ts-expect-error -- `qrcode` ships no types; only QRCode.create is used here.
import QRCode from 'qrcode'
import { useInView } from 'react-intersection-observer'
import { IconSeal, IconToken } from './icons'
import { TOKENS_PER_ATTENDANCE } from '@/lib/constants'

/**
 * Phone mock of on-site check-in. The QR is a real, scannable code (it
 * points at the public events page) drawn from the same `qrcode` package the
 * host QR screen uses. Loops scan → confirmed while on screen; holds on the
 * confirmed state under reduced motion.
 */

function useQrModules(text: string) {
  return useMemo(() => {
    const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' }) as {
      modules: { size: number; get: (r: number, c: number) => number }
    }
    const cells: [number, number][] = []
    for (let r = 0; r < modules.size; r++) {
      for (let c = 0; c < modules.size; c++) if (modules.get(r, c)) cells.push([c, r])
    }
    return { size: modules.size, cells }
  }, [text])
}

export function CheckinPhone({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const { ref, inView } = useInView({ threshold: 0.4 })
  const [done, setDone] = useState(false)
  const qr = useQrModules('https://sproutify.app/events')

  useEffect(() => {
    if (reduced) {
      setDone(true)
      return
    }
    if (!inView) return
    const id = setInterval(() => setDone((d) => !d), done ? 2800 : 2600)
    return () => clearInterval(id)
  }, [inView, reduced, done])

  return (
    <div ref={ref} className={className}>
      <div className="relative mx-auto aspect-[9/18.5] w-full max-w-[250px] rounded-[38px] border-[7px] border-foreground bg-foreground shadow-overlay">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[31px] bg-surface">
          <div className="px-5 pb-3 pt-10">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-subtle-foreground">
              Check in
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-tight">Juhu Beach Cleanup</p>
          </div>

          <div className="relative mx-4 flex-1 overflow-hidden rounded-2xl bg-foreground">
            <AnimatePresence mode="wait" initial={false}>
              {!done ? (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center p-6"
                >
                  <div className="relative w-full">
                    <svg
                      viewBox={`-2 -2 ${qr.size + 4} ${qr.size + 4}`}
                      className="w-full rounded-lg bg-white"
                      shapeRendering="crispEdges"
                      aria-label="Event check-in QR code"
                      role="img"
                    >
                      {qr.cells.map(([x, y]) => (
                        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#18211C" />
                      ))}
                    </svg>
                    {/* Viewfinder corners */}
                    {['left-0 top-0 border-l-4 border-t-4 rounded-tl-lg', 'right-0 top-0 border-r-4 border-t-4 rounded-tr-lg', 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg', 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg'].map((c) => (
                      <span key={c} className={`absolute -m-3 size-7 border-stamp ${c}`} />
                    ))}
                    <span className="absolute inset-x-[-6px] top-0 h-0.5 animate-scan rounded-full bg-stamp shadow-[0_0_14px_2px_hsl(var(--stamp)/0.7)]" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-primary-700 p-5 text-center text-background"
                >
                  <motion.span
                    initial={{ scale: 1.6, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: -6, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
                  >
                    <IconSeal size={64} />
                  </motion.span>
                  <p className="mt-3 font-display text-lg leading-none">Checked in</p>
                  <p className="mt-2 text-xs text-primary-100">Hours on site are now on your record.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="m-4 flex items-center justify-between rounded-xl bg-surface-sunken px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs font-medium">
              <IconToken size={20} className="text-stamp" />
              EcoTokens
            </span>
            <span className="font-mono text-sm font-semibold">
              {done ? `+${TOKENS_PER_ATTENDANCE}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
