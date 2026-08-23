import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'

interface StatCardProps {
  label: string
  value: number | string | null | undefined
  icon?: LucideIcon
  /**
   * OPTIONAL BY DESIGN. The old dashboards rendered hardcoded strings here
   * regardless of real data — "+8 this month", "2 this week", "+25 today" on
   * the volunteer dashboard and "+15% this month" on the admin one, none of
   * which were ever computed. If a delta cannot be derived honestly, pass
   * nothing and no chip renders.
   */
  delta?: { value: number; label: string } | null
  className?: string
}

export function StatCard({ label, value, icon: Icon, delta, className }: StatCardProps) {
  const display = typeof value === 'number' ? formatNumber(value) : (value ?? '—')
  const isUp = delta ? delta.value >= 0 : false

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label text-muted-foreground">{label}</p>
          <p className="stat-value mt-1.5 text-display-lg text-foreground">{display}</p>
          {delta && (
            <span
              className={cn(
                'mt-2 inline-flex items-center rounded-sm px-1.5 py-0.5 text-caption',
                isUp
                  ? 'bg-success-subtle text-success'
                  : 'bg-destructive-subtle text-destructive'
              )}
            >
              {isUp ? '+' : ''}
              {delta.value} {delta.label}
            </span>
          )}
        </div>
        {Icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
            <Icon size={18} strokeWidth={1.75} />
          </div>
        )}
      </div>
    </Card>
  )
}
