import { cn } from '@/lib/utils'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  /** Buttons or controls aligned to the right on wide screens. */
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-overline uppercase text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="text-h1 text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-body text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
