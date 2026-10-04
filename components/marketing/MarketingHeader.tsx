import { Container } from '@/components/patterns/Container'
import type { AppIcon } from '@/components/passport/icons'
import { cn } from '@/lib/utils'
import { RevealText } from './Motion'

/**
 * Opening block for inner marketing pages. The label is styled as the tab
 * on a passport page (icon + mono caps), the headline is the expanded black
 * display cut, and a page-specific stamp can sit to the right.
 */
export function MarketingHeader({
  label,
  icon: Icon,
  lines,
  accent,
  description,
  aside,
  children,
  className,
}: {
  label: string
  icon: AppIcon
  /** Headline lines in ink. */
  lines: string[]
  /** Optional final line, set in stamp orange. */
  accent?: string
  description?: string
  /** Right-hand visual, usually a <Stamp />. Hidden on small screens. */
  aside?: React.ReactNode
  /** Under the description, e.g. CTAs. */
  children?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn('pb-12 pt-14 md:pb-16 md:pt-20', className)}>
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-primary-900/15 bg-surface px-3 py-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-primary-700">
              <Icon size={16} />
              {label}
            </p>
            <h1 className="mt-6 font-display text-hero text-foreground">
              {lines.map((line, i) => (
                <RevealText key={line} text={line} startDelay={i * 0.12} className="block" />
              ))}
              {accent && (
                <RevealText text={accent} startDelay={lines.length * 0.12} className="block text-stamp" />
              )}
            </h1>
          </div>
          {aside && <div className="hidden pb-2 lg:block">{aside}</div>}
        </div>

        {(description || children) && (
          <div className="mt-10 grid gap-6 border-t-2 border-dashed border-primary-900/15 pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            {description && (
              <p className="max-w-2xl animate-fade-up text-body-lg text-muted-foreground [animation-delay:450ms]">
                {description}
              </p>
            )}
            {children && <div className="animate-fade-up [animation-delay:600ms]">{children}</div>}
          </div>
        )}
      </Container>
    </header>
  )
}
