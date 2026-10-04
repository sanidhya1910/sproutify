import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { Button } from '@/components/ui/button'
import { Stamp } from '@/components/passport/Stamp'
import { IconPassport } from '@/components/passport/icons'

interface CtaLink {
  href: string
  label: string
}

/**
 * Closing call to action shared by marketing pages: a stamp-orange slab with
 * the organisation's own seal pressed into the corner (founded 2020, per the
 * About page timeline).
 */
export function CtaPanel({
  title,
  body,
  primary,
  secondary,
}: {
  title: string[]
  body?: string
  primary: CtaLink
  secondary?: CtaLink
}) {
  return (
    <section className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-stamp text-white">
        {/* Big seal, cropped by the panel edge */}
        <div className="pointer-events-none absolute -right-16 -top-10 -z-10 w-[340px] opacity-30 md:-right-10 md:w-[420px]">
          <Stamp top="Sproutify · Mumbai" bottom="Est. 2020" icon={IconPassport} ink="paper" rotate={14} fluid seed={21} />
        </div>
        <Container className="py-20 md:py-28">
          <h2 className="max-w-4xl font-display text-hero">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          {body && <p className="mt-6 max-w-xl text-body-lg text-white/90">{body}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-foreground px-6 text-background hover:bg-primary-900"
            >
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight strokeWidth={2} />
              </Link>
            </Button>
            {secondary && (
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 rounded-full border-white/40 bg-transparent px-6 text-white hover:bg-white/10"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </Container>
      </div>
    </section>
  )
}
