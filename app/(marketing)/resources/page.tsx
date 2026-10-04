import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { Reveal } from '@/components/patterns/Reveal'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { CtaPanel } from '@/components/marketing/CtaPanel'
import { IconGuide } from '@/components/passport/icons'
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
 *
 * Presented as a numbered index, like a field manual's contents page: the
 * guides are a sequence of reading, not a product grid.
 */
export default function ResourcesPage() {
  return (
    <>
      <MarketingHeader
        label="Field guides"
        icon={IconGuide}
        lines={['How to run one,']}
        accent="written down."
        description="What we have learned running these events, so you can run one too. Each guide walks through preparation, the day itself, and what to record afterwards."
      />

      <Container className="pb-section md:pb-section-lg">
        <ol className="border-t-2 border-dashed border-primary-900/15">
          {GUIDES.map((guide, i) => {
            const Icon = guide.icon
            const tipCount = guide.sections.reduce((n, s) => n + s.tips.length, 0)

            return (
              <li key={guide.id} className="border-b-2 border-dashed border-primary-900/15">
                <Reveal delay={i * 60}>
                  <Link
                    href={`/resources/${guide.id}`}
                    className="group relative isolate grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 py-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[4rem_minmax(0,1fr)_14rem_auto] sm:gap-8 md:py-10"
                  >
                    {/* Hover wash bleeds past the container edge. */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 -left-5 -right-5 -z-10 origin-bottom scale-y-0 rounded-2xl bg-surface transition-transform duration-500 ease-out group-hover:scale-y-100 md:-left-8 md:-right-8"
                    />
                    <span className="font-mono text-sm font-semibold text-subtle-foreground transition-colors group-hover:text-stamp-ink">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-4">
                        <span className="hidden size-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary-600/40 text-primary-600 transition-transform duration-500 group-hover:-rotate-12 sm:flex">
                          <Icon size={30} />
                        </span>
                        <span className="text-[clamp(1.35rem,1rem+1.2vw,2rem)] font-bold leading-tight tracking-[-0.02em] text-foreground">
                          {guide.title}
                        </span>
                      </span>
                      <span className="mt-2 block max-w-2xl text-body text-muted-foreground sm:pl-[4.5rem]">
                        {guide.description}
                      </span>
                    </span>
                    <span className="hidden text-body-sm text-muted-foreground sm:block">
                      <span className="tnum">{guide.sections.length}</span> steps ·{' '}
                      <span className="tnum">{tipCount}</span> tips
                    </span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-primary-900/15 text-primary-800 transition-all duration-500 group-hover:rotate-45 group-hover:border-stamp group-hover:bg-stamp group-hover:text-white">
                      <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </Container>

      <CtaPanel
        title={['Read it.', 'Then go do it.']}
        body="Join an event that is already scheduled, or get in touch about running one with your community."
        primary={{ href: '/events', label: 'View events' }}
        secondary={{ href: '/contact', label: 'Get in touch' }}
      />
    </>
  )
}
