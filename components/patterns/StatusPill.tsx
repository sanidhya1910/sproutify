import { cn } from '@/lib/utils'

export type PillTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

const TONES: Record<PillTone, string> = {
  neutral: 'bg-surface-sunken text-muted-foreground border-border',
  primary: 'bg-primary-50 text-primary-800 border-primary-100',
  success: 'bg-success-subtle text-success border-transparent',
  warning: 'bg-warning-subtle text-warning border-transparent',
  danger: 'bg-destructive-subtle text-destructive border-transparent',
  info: 'bg-accent-subtle text-accent border-transparent',
}

/**
 * Replaces every hardcoded Chip colour in the app — role badges were #f44336
 * red / #2196f3 blue, event types picked from four undeclared greens, and
 * status pills used raw Tailwind palette classes. Tone is semantic; red now
 * exclusively means danger.
 */
export function StatusPill({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: PillTone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-caption',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
