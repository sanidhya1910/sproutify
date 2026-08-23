import { cn } from '@/lib/utils'
import { Container } from './Container'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: 'default' | 'sunken' | 'brand'
  /** Set false when the child needs to control its own width (e.g. full-bleed media). */
  contained?: boolean
}

export function Section({
  tone = 'default',
  contained = true,
  className,
  children,
  ...props
}: SectionProps) {
  const body = contained ? <Container>{children}</Container> : children
  return (
    <section
      className={cn(
        'py-section md:py-section-lg',
        tone === 'sunken' && 'bg-surface-sunken',
        tone === 'brand' && 'bg-primary-900 text-primary-100',
        className
      )}
      {...props}
    >
      {body}
    </section>
  )
}
