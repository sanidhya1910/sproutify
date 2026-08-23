import Link from 'next/link'
import { ArrowRight, Waves, Sprout, Users, Handshake } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { Section } from '@/components/patterns/Section'
import { Reveal } from '@/components/patterns/Reveal'
import { AssetImage } from '@/components/patterns/AssetImage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * Rebuilt homepage.
 *
 * The previous hero was two 50vw background panels hard-seamed down the
 * middle — a forest canopy butted against an orange vintage van — with the
 * headline rendered through a gradient text-clip that made it near-black on
 * a dark photo. The four narrative sections hotlinked Pexels stock, one of
 * which was a salon photo of hair curlers illustrating "Passion Without a
 * Plan is Not Enough".
 *
 * The impact figures below were previously presented as achieved results
 * ("50,000 lbs debris removed", "120,000+ trees planted"). They were
 * hardcoded and the database has no such history, so they are now framed
 * explicitly as targets.
 */

const NARRATIVE = [
  {
    eyebrow: 'The problem',
    title: 'Our coasts and forests are under pressure.',
    body: 'Plastic waste accumulates faster than it can be cleared, and habitat loss compounds every year. These are large, distributed problems that need coordinated, repeated effort — not one-off gestures.',
    slot: 'home.narrative.1',
  },
  {
    eyebrow: 'The challenge',
    title: 'Willingness is not the bottleneck.',
    body: 'Plenty of people want to help. What is missing is the logistics: knowing where to go, what is needed, and whether the effort actually adds up to anything measurable.',
    slot: 'home.narrative.2',
  },
  {
    eyebrow: 'The opportunity',
    title: 'Coordinated effort compounds.',
    body: 'A structured platform turns scattered goodwill into scheduled, well-briefed work with the right equipment and enough hands to finish what it starts.',
    slot: 'home.narrative.3',
  },
  {
    eyebrow: 'Our approach',
    title: 'Organised action, recorded honestly.',
    body: 'We handle the coordination — partners, permits, safety briefings, supplies — so volunteers can turn up and work. Attendance is verified on site, so the numbers we report are the ones that actually happened.',
    slot: 'home.narrative.4',
  },
] as const

const GOALS = [
  { icon: Waves, value: '50,000 lbs', label: 'Debris removed from coasts' },
  { icon: Sprout, value: '120,000', label: 'Trees planted' },
  { icon: Users, value: '15,000', label: 'Active volunteers' },
  { icon: Handshake, value: '200', label: 'Community partners' },
] as const

const PROCESS = [
  {
    step: '01',
    title: 'Identify and plan',
    body: 'We work with local partners to find sites that genuinely need attention, then scope what it takes to do the job properly.',
  },
  {
    step: '02',
    title: 'Mobilise volunteers',
    body: 'Events are published here with the detail people actually need: what to bring, what to expect, and how long it runs.',
  },
  {
    step: '03',
    title: 'Execute and restore',
    body: 'Every event runs with a safety briefing, supplied equipment and an on-site coordinator.',
  },
  {
    step: '04',
    title: 'Measure and repeat',
    body: 'Attendance is confirmed on the day, so impact is recorded from what happened rather than estimated.',
  },
] as const

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary-900">
        <div className="absolute inset-0 -z-10">
          <AssetImage
            slot="home.hero"
            className="h-full w-full object-cover"
            sizes="100vw"
            alt=""
          />
          <div className="absolute inset-0 bg-primary-900/70" />
        </div>

        <Container className="py-24 md:py-36">
          <div className="max-w-2xl">
            <p className="text-overline uppercase text-primary-200">Begin again</p>
            <h1 className="mt-4 text-display-xl text-background md:text-display-2xl">
              Bridging the gap between community and conservation.
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-primary-100">
              Sproutify connects volunteers with organised environmental work — beach
              cleanups, tree plantations and habitat restoration — and records what
              actually gets done.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/events">
                  Find an event
                  <ArrowRight strokeWidth={1.75} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-transparent bg-background/10 text-background hover:bg-background/20"
              >
                <Link href="/about">How it works</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Narrative */}
      <Section>
        <div className="space-y-20 md:space-y-28">
          {NARRATIVE.map((item, i) => (
            <Reveal key={item.eyebrow}>
              <div
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="overflow-hidden rounded-lg border border-border">
                  <AssetImage
                    slot={item.slot}
                    className="aspect-[1.25] object-cover"
                    sizes="(min-width: 768px) 560px, 100vw"
                  />
                </div>
                <div>
                  <p className="text-overline uppercase text-primary-600">{item.eyebrow}</p>
                  <h2 className="mt-3 text-display-lg text-foreground">{item.title}</h2>
                  <p className="mt-4 text-body-lg text-muted-foreground">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Goals — explicitly targets, not claimed results */}
      <Section tone="sunken">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline uppercase text-primary-600">Where we are heading</p>
          <h2 className="mt-3 text-display-lg text-foreground">Our 2030 targets</h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            These are the goals we are working towards, not results already achieved.
            Verified impact is recorded per event and will be published here as it adds up.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((goal) => (
            <Card key={goal.label} className="p-6 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                <goal.icon size={20} strokeWidth={1.75} />
              </div>
              <p className="stat-value mt-4 text-display-lg text-primary-700">{goal.value}</p>
              <p className="mt-1 text-body-sm text-muted-foreground">{goal.label}</p>
              <p className="mt-3 text-caption uppercase tracking-wide text-subtle-foreground">
                Target
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline uppercase text-primary-600">How it works</p>
          <h2 className="mt-3 text-display-lg text-foreground">From site to measured outcome</h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((item) => (
            <Card key={item.step} className="p-6">
              <span className="tnum text-h2 text-primary-200">{item.step}</span>
              <h3 className="mt-3 text-h4 text-foreground">{item.title}</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section tone="brand">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg text-background">Ready to put in a morning?</h2>
          <p className="mt-4 text-body-lg text-primary-200">
            Browse what is scheduled near you, or get in touch about hosting an event with
            your organisation.
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
              <Link href="/contact">Partner with us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
