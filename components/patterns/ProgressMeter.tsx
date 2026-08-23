import { cn } from '@/lib/utils'
import { toPercent } from '@/lib/format'

interface ProgressMeterProps {
  value: number | null | undefined
  max?: number | null | undefined
  label?: string
  /** Rendered when the percentage can't be computed (e.g. zero denominator). */
  emptyLabel?: string
  tone?: 'primary' | 'success' | 'accent'
  className?: string
}

/**
 * The divide-by-zero guard lives HERE, not in each page.
 *
 * The admin dashboard computed `attendances / registrations * 100` inline and
 * printed "NaN%" for any event nobody had registered for yet, then fed that
 * NaN straight into a progress bar.
 */
export function ProgressMeter({
  value,
  max,
  label,
  emptyLabel = 'No data yet',
  tone = 'primary',
  className,
}: ProgressMeterProps) {
  const pct = max == null ? (value == null ? null : Math.min(100, Math.max(0, value))) : toPercent(value, max)

  return (
    <div className={cn('w-full', className)}>
      {(label || pct !== null || emptyLabel) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label && <span className="text-label text-muted-foreground">{label}</span>}
          <span className="tnum text-label text-foreground">
            {pct === null ? emptyLabel : `${Math.round(pct)}%`}
          </span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500',
            tone === 'primary' && 'bg-primary',
            tone === 'success' && 'bg-success',
            tone === 'accent' && 'bg-accent'
          )}
          style={{ width: `${pct ?? 0}%` }}
        />
      </div>
    </div>
  )
}
