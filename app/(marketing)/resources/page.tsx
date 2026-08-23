import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { PageHeader } from '@/components/patterns/PageHeader'
import { StatusPill } from '@/components/patterns/StatusPill'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GUIDES } from '@/lib/resources'

export const metadata = {
  title: 'Guides',
  description:
    'Practical guides for running beach cleanups, tree plantations, waste management, e-waste disposal and water conservation projects.',
}

/**
 * Rebuilt from a 672-line page that inlined all 80 tips as JSX. The content
 * now lives in lib/resources.ts, so this is presentation only, and each guide
 * finally has its own linkable page — previously the guides had ids but
 * nothing routed to them, and /resources/[id] threw a ReferenceError.
 */
export default function ResourcesPage() {
  return (
    <Container className="py-12 md:py-16">
      <PageHeader
        eyebrow="Resources"
        title="Field guides"
        description="What we have learned running these events, written down so you can run one too."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => {
          const Icon = guide.icon
          const tipCount = guide.sections.reduce((n, s) => n + s.tips.length, 0)

          return (
            <Card key={guide.id} variant="interactive" className="flex flex-col p-6">
              <div className="flex size-11 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                <Icon size={20} strokeWidth={1.75} />
              </div>

              <h2 className="mt-4 text-h3 text-foreground">
                <Link
                  href={`/resources/${guide.id}`}
                  className="transition-colors hover:text-primary-700"
                >
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-body-sm text-muted-foreground">
                {guide.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill tone={guide.tone}>{guide.sections.length} steps</StatusPill>
                <StatusPill tone="neutral">{tipCount} tips</StatusPill>
              </div>

              <Button asChild variant="secondary" size="sm" className="mt-5 w-full">
                <Link href={`/resources/${guide.id}`}>
                  Read guide
                  <ArrowRight strokeWidth={1.75} />
                </Link>
              </Button>
            </Card>
          )
        })}
      </div>

      <Card className="mt-12 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-start gap-4">
          <div className="hidden size-11 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700 sm:flex">
            <BookOpen size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-h4 text-foreground">Ready to put a guide to use?</h2>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Join an event that is already scheduled, or get in touch about running one.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button asChild variant="secondary">
            <Link href="/contact">Get in touch</Link>
          </Button>
          <Button asChild>
            <Link href="/events">View events</Link>
          </Button>
        </div>
      </Card>
    </Container>
  )
}
