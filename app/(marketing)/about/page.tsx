import Link from 'next/link'
import { Leaf, Globe2, TrendingUp, BadgeCheck } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { Section } from '@/components/patterns/Section'
import { Reveal } from '@/components/patterns/Reveal'
import { AssetImage } from '@/components/patterns/AssetImage'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
    icon: Leaf,
    title: 'Real work, properly run',
    body: 'Every event has a local partner, a safety briefing and the equipment needed to actually finish the job.',
  },
  {
    icon: Globe2,
    title: 'Local by default',
    body: 'Restoration only works when the people doing it live nearby and come back. We build around communities, not one-off drives.',
  },
  {
    icon: TrendingUp,
    title: 'Effort that compounds',
    body: 'Repeat visits to the same sites beat scattered activity. We plan for the second and third visit from the start.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified, not estimated',
    body: 'Attendance is confirmed on site via QR check-in, so what we report is what happened — not a projection.',
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
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-overline uppercase text-primary-600">About Sproutify</p>
            <h1 className="mt-3 text-display-xl text-foreground">
              Cultivating a greener tomorrow
            </h1>
            <p className="mt-5 text-body-lg text-muted-foreground">
              Sproutify exists to close the gap between people who want to help and
              environmental work that genuinely needs hands. We handle coordination,
              partners and logistics so volunteers can turn up and do the work.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/events">See upcoming events</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/contact">Partner with us</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <AssetImage
              slot="about.story"
              className="aspect-video object-cover"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
        </div>
      </Section>

      <Section tone="sunken">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline uppercase text-primary-600">How we work</p>
          <h2 className="mt-3 text-display-lg text-foreground">Four things we hold to</h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <Card key={item.title} className="p-6">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                <item.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-h3 text-foreground">{item.title}</h3>
              <p className="mt-2 text-body text-muted-foreground">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline uppercase text-primary-600">Our journey</p>
          <h2 className="mt-3 text-display-lg text-foreground">How we got here</h2>
        </div>

        <ol className="mx-auto mt-12 max-w-2xl">
          {MILESTONES.map((m, i) => (
            <li key={m.year} className="relative flex gap-6 pb-10 last:pb-0">
              {i < MILESTONES.length - 1 && (
                <span
                  className="absolute left-[27px] top-14 h-[calc(100%-3.5rem)] w-px bg-border"
                  aria-hidden
                />
              )}
              <span className="tnum flex size-14 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-body-sm font-semibold text-primary-800">
                {m.year}
              </span>
              <Reveal className="pt-2.5">
                <h3 className="text-h4 text-foreground">{m.title}</h3>
                <p className="mt-1.5 text-body text-muted-foreground">{m.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="brand">
        <Container className="text-center">
          <h2 className="text-display-lg text-background">Join the next one</h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-primary-200">
            Most of our volunteers came for one event and stayed. Start with whatever is
            scheduled nearest you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Become a volunteer</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="border-transparent bg-background/10 text-background hover:bg-background/20"
            >
              <Link href="/events">Browse events</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
