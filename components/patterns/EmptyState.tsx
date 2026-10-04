import type { AnyIcon } from '@/components/passport/icons'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: AnyIcon
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
        'flex flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-primary-900/15 bg-surface/50 px-6 py-14 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-5 flex size-14 -rotate-6 items-center justify-center rounded-full border-2 border-dashed border-primary-600/40 text-primary-600">
          <Icon size={26} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-h3 font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-body-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
