import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Replaces ~8 ad-hoc "no data" blocks, each of which had its own icon size,
 * spacing and copy tone.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-14 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-primary-50 text-primary-700">
          <Icon size={20} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-h4 text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-body-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
