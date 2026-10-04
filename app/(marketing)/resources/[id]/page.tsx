import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { StatusPill } from '@/components/patterns/StatusPill'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GUIDES, getGuide } from '@/lib/resources'

/**
 * Replaces a route that threw a ReferenceError on every request: it was a
 * stale copy of a list page referencing an undefined <ResourceItem>, ignored
 * its `params` entirely, and rendered two hardcoded sample resources.
 */

export function generateStaticParams() {
  return GUIDES.map((g) => ({ id: g.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guide = getGuide(id)
  if (!guide) return { title: 'Guide not found' }
  return { title: guide.title, description: guide.description }
}

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guide = getGuide(id)

  if (!guide) notFound()

  const Icon = guide.icon
  const tipCount = guide.sections.reduce((n, s) => n + s.tips.length, 0)

  return (
    <Container className="py-10 md:py-14">
      <Link
        href="/resources"
        className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} strokeWidth={1.75} />
        All guides
      </Link>

      <header className="mt-8 pb-10">
        <div className="flex size-12 items-center justify-center rounded-md bg-primary-50 text-primary-700">
          <Icon size={22} strokeWidth={1.75} />
        </div>
        <h1 className="mt-6 font-display text-mega text-primary-900">{guide.title}</h1>
        <p className="mt-3 max-w-2xl text-body-lg text-muted-foreground">
          {guide.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill tone={guide.tone}>{guide.sections.length} steps</StatusPill>
          <StatusPill tone="neutral">{tipCount} tips</StatusPill>
        </div>
      </header>

      <ol className="border-t border-primary-900/15">
        {guide.sections.map((section, i) => (
          <li key={section.title} className="border-b border-primary-900/15 py-10 md:py-12">
            <div className="grid gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8">
              <span className="font-mono text-lg font-semibold leading-none text-stamp-ink">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 max-w-3xl">
                <h2 className="font-display text-[2rem] leading-tight tracking-[-0.02em] text-primary-900">
                  {section.title}
                </h2>
                <p className="mt-3 text-body-lg text-muted-foreground">{section.content}</p>

                <h3 className="mt-5 text-overline uppercase text-muted-foreground">
                  Key tips
                </h3>
                <ul className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {section.tips.map((tip) => (
                    <li key={tip} className="flex gap-2.5 text-body-sm text-foreground">
                      <Check
                        size={16}
                        strokeWidth={2}
                        className="mt-0.5 shrink-0 text-primary-600"
                      />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Card className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-primary-50 p-8 text-center sm:flex-row sm:justify-between sm:text-left md:p-10">
        <div>
          <h2 className="font-display text-h1 text-primary-900">Put this into practice</h2>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Find an event that needs volunteers, or talk to us about organising one.
          </p>
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
