import Link from 'next/link'
import { ArrowRight, Waves, Sprout, Users, Handshake } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { Section } from '@/components/patterns/Section'
import { Reveal } from '@/components/patterns/Reveal'
import { AssetImage } from '@/components/patterns/AssetImage'
import { Button } from '@/components/ui/button'

/**
 * Rebuilt homepage.
 *
 * The previous hero was two 50vw background panels hard-seamed down the
 * middle (a forest canopy butted against an orange vintage van) with the
 * headline rendered through a gradient text-clip that made it near-black on
 * a dark photo. The four narrative sections hotlinked Pexels stock, one of
 * which was a salon photo of hair curlers illustrating "Passion Without a
 * Plan is Not Enough".
 *
 * Layout rhythm is deliberate. The page previously ran four consecutive
 * image-left/image-right zigzag blocks, then two back-to-back four-up card
 * grids, which read as one templated pattern repeated eight times. It now
 * moves through four distinct layout families: split hero, two zigzag
 * blocks, a two-up media grid, a hairline-divided figure band, and a
 * connected process rail.
 *
 * The impact figures below were previously presented as achieved results
 * ("50,000 lbs debris removed", "120,000+ trees planted"). They were
 * hardcoded and the database has no such history, so they are framed
 * explicitly as targets.
 */

// First two run as full-width zigzag blocks; the second pair collapses into
// a two-up media grid so the alternation never runs more than twice.
const NARRATIVE_LEAD = [
  {
    key: 'problem',
    eyebrow: 'The problem',
    title: 'Our coasts and forests are under pressure.',
    body: 'Plastic waste accumulates faster than it can be cleared, and habitat loss compounds every year. These are large, distributed problems that need coordinated, repeated effort rather than one-off gestures.',
    slot: 'home.narrative.1',
  },
  {
    key: 'challenge',
    eyebrow: null,
    title: 'Willingness is not the bottleneck.',
    body: 'Plenty of people want to help. What is missing is the logistics: knowing where to go, what is needed, and whether the effort actually adds up to anything measurable.',
    slot: 'home.narrative.2',
  },
] as const

const NARRATIVE_PAIR = [
  {
    key: 'opportunity',
    title: 'Coordinated effort compounds.',
    body: 'A structured platform turns scattered goodwill into scheduled, well-briefed work with the right equipment and enough hands to finish what it starts.',
    slot: 'home.narrative.3',
  },
  {
    key: 'approach',
    title: 'Organised action, recorded honestly.',
    body: 'We handle partners, permits, safety briefings and supplies, so volunteers can turn up and work. Attendance is verified on site, so the numbers we report are the ones that actually happened.',
    slot: 'home.narrative.4',
  },
] as const

const GOALS = [
  { icon: Waves, value: '50,000', unit: 'lbs', label: 'Debris removed from coasts' },
  { icon: Sprout, value: '120,000', unit: null, label: 'Trees planted' },
  { icon: Users, value: '15,000', unit: null, label: 'Active volunteers' },
  { icon: Handshake, value: '200', unit: null, label: 'Community partners' },
] as const

const PROCESS = [
  {
    title: 'Identify and plan',
    body: 'We work with local partners to find sites that genuinely need attention, then scope what it takes to do the job properly.',
  },
  {
    title: 'Mobilise volunteers',
    body: 'Events are published here with the detail people actually need: what to bring, what to expect, and how long it runs.',
  },
  {
    title: 'Execute and restore',
    body: 'Every event runs with a safety briefing, supplied equipment and an on-site coordinator.',
  },
  {
    title: 'Measure and repeat',
    body: 'Attendance is confirmed on the day, so impact is recorded from what happened rather than estimated.',
  },
] as const

export default function HomePage() {
  return (
    <>
      {/* Hero. The scrim is a directional gradient, not a flat wash: a uniform
          bg-primary-900/70 over the whole frame flattened a golden-hour
          photograph into a single olive tone. */}
      <section className="relative isolate overflow-hidden bg-primary-900">
        <div className="absolute inset-0 -z-10">
          <AssetImage
            slot="home.hero"
            className="h-full w-full object-cover"
            sizes="100vw"
            alt=""
          />
          {/* Base darkening keeps the whole frame readable; the directional
              gradient on top concentrates it behind the copy so the right
              half of the photograph still reads as a photograph. */}
          <div className="absolute inset-0 bg-primary-900/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-900/60 to-transparent" />
        </div>

        <Container className="flex min-h-[max(560px,72dvh)] flex-col justify-center py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-display-lg text-background md:text-display-xl">
              Bridging the gap between community and conservation.
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-primary-100">
              Organised environmental work near you: cleanups, plantations and habitat
              restoration, with every hour on site verified.
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
                className="border-background/25 bg-background/10 text-background backdrop-blur-sm hover:bg-background/20"
              >
                <Link href="/about">How it works</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Narrative: two zigzag blocks, then the pattern breaks. */}
      <Section>
        <div className="space-y-20 md:space-y-28">
          {NARRATIVE_LEAD.map((item, i) => (
            <Reveal key={item.key}>
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
                  {item.eyebrow && (
                    <p className="text-overline uppercase text-primary-600">{item.eyebrow}</p>
                  )}
                  <h2 className="mt-3 text-display-lg text-foreground">{item.title}</h2>
                  <p className="mt-4 text-body-lg text-muted-foreground">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Two-up media grid. Same content family as above, different
            composition, so the zigzag never runs a third time. */}
        <div className="mt-20 grid gap-8 md:mt-28 md:grid-cols-2 md:gap-10">
          {NARRATIVE_PAIR.map((item) => (
            <Reveal key={item.key}>
              <article className="flex h-full flex-col">
                <div className="overflow-hidden rounded-lg border border-border">
                  <AssetImage
                    slot={item.slot}
                    className="aspect-[1.6] object-cover"
                    sizes="(min-width: 768px) 560px, 100vw"
                  />
                </div>
                <h2 className="mt-6 text-h2 text-foreground">{item.title}</h2>
                <p className="mt-3 text-body text-muted-foreground">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Goals. Previously four identical bordered cards, which read as the
          same grid as the process section directly below it. Now a figure
          band separated by hairlines: no card chrome, numbers carry it. */}
      <Section tone="sunken">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <p className="text-overline uppercase text-primary-600">Where we are heading</p>
            <h2 className="mt-3 text-display-lg text-foreground">Our 2030 targets</h2>
            <p className="mt-4 text-body text-muted-foreground">
              These are the goals we are working towards, not results already achieved.
              Verified impact is recorded per event and published here as it adds up.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {GOALS.map((goal) => (
              <div key={goal.label} className="bg-surface p-6">
                <goal.icon
                  className="text-primary-400"
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <dd className="stat-value mt-4 flex items-baseline gap-1.5 text-display-lg text-primary-800">
                  {goal.value}
                  {goal.unit && (
                    <span className="text-h4 font-medium text-primary-600">{goal.unit}</span>
                  )}
                </dd>
                <dt className="mt-1 text-body-sm text-muted-foreground">{goal.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Process. The "01 02 03 04" display numerals were the loudest thing on
          the page and duplicated the goals grid one section earlier. Now a
          connected rail: the marker is structural, the step title leads. */}
      <Section>
        <div className="max-w-2xl">
          <h2 className="text-display-lg text-foreground">From site to measured outcome</h2>
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PROCESS.map((item, i) => (
            <li key={item.title} className="relative">
              {/* The rail bridges the grid gap (lg:gap-6 = 1.5rem), so it has
                  to run wider than the cell it starts in. */}
              {i < PROCESS.length - 1 && (
                <span
                  className="absolute left-2.5 top-[5px] hidden h-px w-[calc(100%+1.5rem)] bg-border lg:block"
                  aria-hidden
                />
              )}
              <span className="relative z-10 flex size-2.5 rounded-full bg-primary ring-4 ring-background" />
              <h3 className="mt-5 text-h4 text-foreground">{item.title}</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
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
            <Button
              asChild
              size="lg"
              className="bg-background text-primary-900 hover:bg-primary-50"
            >
              <Link href="/register">Become a volunteer</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="border-background/25 bg-transparent text-background hover:bg-background/10"
            >
              <Link href="/contact">Partner with us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
