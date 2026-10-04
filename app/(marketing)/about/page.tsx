import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { Reveal } from '@/components/patterns/Reveal'
import { AssetImage } from '@/components/patterns/AssetImage'
import { Button } from '@/components/ui/button'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { Timeline } from '@/components/marketing/Timeline'
import { CtaPanel } from '@/components/marketing/CtaPanel'
import { Stamp } from '@/components/passport/Stamp'
import {
  IconPassport,
  IconPin,
  IconSapling,
  IconScan,
  IconSeal,
} from '@/components/passport/icons'

export const metadata = {
  title: 'About',
  description:
    'How Sproutify coordinates volunteers, partners and verified environmental action.',
}

/**
 * Rebuilt /about.
 *
 * Two content decisions carried over from the audit:
 *
 * 1. The team section is GONE. It listed four people — Sarah Chen, Marcus
 *    Johnson, Elena Rodriguez, David Kim — whose headshot files did not
 *    exist (four permanent 404s), while two real team photos sat unused in
 *    public/team/. Rather than invent faces for fictional staff on a live
 *    site, the section is removed until there is a real team to show.
 *
 * 2. The animated counters previously read 15,420 trees / 2,840 volunteers /
 *    186 events as achieved results. They were hardcoded and the database has
 *    no such history, so the milestones below describe intent and the
 *    numbers moved to the homepage framed explicitly as targets.
 */

const PRINCIPLES = [
  {
    icon: IconSeal,
    title: 'Real work, properly run',
    body: 'Every event has a local partner, a safety briefing and the equipment needed to actually finish the job.',
  },
  {
    icon: IconPin,
    title: 'Local by default',
    body: 'Restoration only works when the people doing it live nearby and come back. We build around communities, not one-off drives.',
  },
  {
    icon: IconSapling,
    title: 'Effort that compounds',
    body: 'Repeat visits to the same sites beat scattered activity. We plan for the second and third visit from the start.',
  },
  {
    icon: IconScan,
    title: 'Verified, not estimated',
    body: 'Attendance is confirmed on site via QR check-in, so what we report is what happened, not a projection.',
  },
] as const

const MILESTONES = [
  {
    year: '2020',
    title: 'Sproutify founded',
    body: 'Started with a simple observation: plenty of people want to help, and almost none of them know where to show up.',
  },
  {
    year: '2021',
    title: 'First partner network',
    body: 'Began working with local environmental groups rather than running events alone.',
  },
  {
    year: '2022',
    title: 'Coordinated programmes',
    body: 'Moved from one-off cleanups to repeat visits at the same sites, which is where measurable recovery starts.',
  },
  {
    year: '2023',
    title: 'Verified attendance',
    body: 'Introduced on-site QR check-in so impact is recorded from confirmed participation.',
  },
  {
    year: '2024',
    title: 'Volunteer recognition',
    body: 'Added EcoTokens so consistent volunteers get something back for turning up repeatedly.',
  },
] as const

export default function AboutPage() {
  return (
    <>
      <MarketingHeader
        label="About Sproutify"
        icon={IconPassport}
        lines={['Goodwill is', 'everywhere.']}
        accent="Logistics isn’t."
        description="Sproutify exists to close the gap between people who want to help and environmental work that genuinely needs hands. We handle coordination, partners and logistics so volunteers can turn up and do the work."
        aside={
          <div className="w-[200px]">
            <Stamp top="Sproutify · Mumbai" bottom="Est. 2020" icon={IconPassport} ink="orange" rotate={-10} fluid animate delay={0.6} seed={21} />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-full bg-stamp px-6 text-white hover:bg-stamp-ink">
            <Link href="/events">
              See upcoming events
              <ArrowRight strokeWidth={2.25} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="h-12 rounded-full px-6">
            <Link href="/contact">Partner with us</Link>
          </Button>
        </div>
      </MarketingHeader>

      {/* Story photo, taped onto the page */}
      <Container>
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[22px] border-[10px] border-surface shadow-lg md:rotate-[-0.8deg]">
            <AssetImage
              slot="about.story"
              className="aspect-[16/10] object-cover md:aspect-[21/9]"
              sizes="(min-width: 1200px) 1136px, 100vw"
            />
          </div>
          <span aria-hidden className="absolute -top-3 left-[12%] h-8 w-28 rotate-[-6deg] bg-stamp-subtle/80 shadow-sm" />
          <span aria-hidden className="absolute -top-3 right-[14%] h-8 w-24 rotate-[5deg] bg-primary-100/80 shadow-sm" />
        </Reveal>
      </Container>

      {/* Principles */}
      <section className="py-section md:py-section-lg">
        <Container>
          <h2 className="max-w-3xl font-display text-mega">Four things we hold to</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((item, i) => (
              <Reveal
                key={item.title}
                delay={(i % 2) * 90}
                className="group relative rounded-[22px] border border-primary-900/12 bg-surface p-7 transition-transform duration-500 hover:-rotate-[0.6deg] md:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-primary-600/40 text-primary-600 transition-transform duration-500 group-hover:-rotate-12">
                    <item.icon size={30} />
                  </span>
                  <span className="font-mono text-sm font-semibold text-subtle-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-8 text-h2 font-bold tracking-[-0.015em]">{item.title}</h3>
                <p className="mt-2 max-w-md text-body-lg text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Journey */}
      <section className="border-t-2 border-dashed border-primary-900/15 py-section md:py-section-lg">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-display text-mega">How we got here</h2>
              <p className="mt-6 max-w-sm text-body-lg text-muted-foreground">
                Five years of learning what actually makes volunteer work add up, one
                change at a time.
              </p>
            </div>
            <Timeline items={[...MILESTONES]} />
          </div>
        </Container>
      </section>

      <CtaPanel
        title={['Join', 'the next one.']}
        body="Start with whatever is scheduled nearest you. No experience needed: every event runs with a briefing and supplied equipment."
        primary={{ href: '/register', label: 'Get your passport' }}
        secondary={{ href: '/events', label: 'Browse events' }}
      />
    </>
  )
}
