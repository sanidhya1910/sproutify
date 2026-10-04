import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/patterns/Container'
import { Reveal } from '@/components/patterns/Reveal'
import { Button } from '@/components/ui/button'
import { EventCard, type EventCardEvent } from '@/components/events/EventCard'
import { CountUp, RevealText } from '@/components/marketing/Motion'
import { CtaPanel } from '@/components/marketing/CtaPanel'
import { TapeStrip } from '@/components/marketing/TapeStrip'
import { UpcomingEvents } from '@/components/marketing/UpcomingEvents'
import { PassportPage } from '@/components/passport/PassportPage'
import { CheckinPhone } from '@/components/passport/CheckinPhone'
import { RewardsShelf } from '@/components/passport/RewardsShelf'
import { HostConsole } from '@/components/passport/HostConsole'
import { Stamp, TextStamp } from '@/components/passport/Stamp'
import {
  IconCrew,
  IconMegaphone,
  IconScan,
  IconSeal,
  IconShore,
  IconSapling,
  IconTicket,
  IconToken,
  type AppIcon,
} from '@/components/passport/icons'
import { EVENT_TYPE_LIST, type EventTypeId } from '@/lib/event-types'
import { TOKENS_PER_ATTENDANCE } from '@/lib/constants'

/**
 * Homepage — "field passport".
 *
 * The page sells the product by showing it: the passport a volunteer fills,
 * the ticket they pick, the phone they scan in with, the shop they spend in,
 * and the screen a host watches on the day. Every number is either real app
 * behaviour (20 tokens per check-in, the seeded reward prices, the demo
 * accounts) or explicitly labelled as a target or sample.
 */

const SAMPLE_EVENT: EventCardEvent = {
  id: 'sample-juhu',
  title: 'Juhu Beach Cleanup',
  location: 'Juhu Beach, Mumbai',
  date: '2026-10-17',
  startTime: '07:00',
  endTime: '09:30',
  type: 'CLEANUP',
  imageUrl: '/events/juhu-beach-cleanup.webp',
  expectedVolunteers: 40,
  _count: { registrations: 27 },
}

const WHAT_YOU_DO: Record<EventTypeId, string> = {
  CLEANUP: 'Shoreline sweeps timed to low tide. Gloves, sacks and grabbers are supplied.',
  PLANTATION: 'Native saplings into prepared ground, with a plan for who waters them after.',
  EWASTE: 'Collection drives for old phones, cables and batteries, passed on for proper recycling.',
  RESTORATION: 'Mangrove and wetland work alongside partners who know the site.',
  COMMUNITY: 'Neighbourhood gardens, workshops and drives run with resident groups.',
  OTHER: 'Anything else a local partner needs a few more hands for.',
}

const TARGETS: { value: number; unit?: string; label: string; icon: AppIcon }[] = [
  { value: 50000, unit: 'lbs', label: 'of debris off Mumbai’s shoreline', icon: IconShore },
  { value: 120000, label: 'native trees in the ground', icon: IconSapling },
  { value: 15000, label: 'volunteers who come back', icon: IconCrew },
  { value: 200, label: 'local partner organisations', icon: IconMegaphone },
]

function StepTile({
  n,
  title,
  body,
  icon: Icon,
  children,
  className,
}: {
  n: string
  title: string
  body: string
  icon: AppIcon
  children: React.ReactNode
  className?: string
}) {
  return (
    <Reveal
      className={`flex flex-col overflow-hidden rounded-[24px] border border-primary-900/12 bg-surface ${className ?? ''}`}
    >
      <div className="flex items-start gap-4 p-6 md:p-8">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-stamp/60 font-mono text-sm font-semibold text-stamp-ink">
          {n}
        </span>
        <div>
          <h3 className="flex items-center gap-2 text-h3 font-bold tracking-[-0.01em]">
            <Icon size={22} className="text-primary-600" />
            {title}
          </h3>
          <p className="mt-1.5 max-w-md text-body text-muted-foreground">{body}</p>
        </div>
      </div>
      <div className="relative flex flex-1 items-end justify-center overflow-hidden bg-surface-sunken px-6 pt-8 [--ticket-bg:hsl(var(--surface-sunken))]">
        {children}
      </div>
    </Reveal>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero: the passport ───────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Container className="grid items-center gap-14 pb-10 pt-10 md:pt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10 lg:pb-16">
          <div>
            <h1 className="font-display text-hero text-foreground">
              <RevealText text="Show up." className="block" />
              <RevealText text="Get stamped." startDelay={0.15} className="block text-stamp" />
              <RevealText text="Clean up" startDelay={0.3} className="block" />
              <RevealText text="Mumbai." startDelay={0.45} className="block" />
            </h1>
            <p className="mt-7 max-w-xl animate-fade-up text-body-lg text-muted-foreground [animation-delay:500ms]">
              Sproutify lists beach cleanups, tree plantings and e-waste drives across the
              city. Scan in when you arrive, collect a stamp for every event, and trade
              your EcoTokens for gear.
            </p>
            <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:650ms]">
              <Button asChild size="lg" className="h-[3.25rem] rounded-full bg-stamp px-7 text-white hover:bg-stamp-ink">
                <Link href="/events">
                  Find an event
                  <ArrowRight strokeWidth={2.25} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-[3.25rem] rounded-full px-5 font-semibold">
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>
            <ul className="mt-10 flex animate-fade-up flex-wrap gap-x-6 gap-y-3 [animation-delay:800ms]">
              {[
                { icon: IconToken, text: `${TOKENS_PER_ATTENDANCE} tokens per check-in` },
                { icon: IconScan, text: 'QR-verified hours' },
                { icon: IconTicket, text: 'Free to join' },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-2 font-mono text-[0.78rem] text-muted-foreground">
                  <f.icon size={20} className="text-primary-600" />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-4 pb-6 pt-8 sm:px-10 lg:px-4">
            <PassportPage />
          </div>
        </Container>
      </section>

      <TapeStrip />

      {/* ── How it works, as the product ─────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 py-section md:py-section-lg">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-3xl font-display text-mega">From sign-up to stamp, in four stops</h2>
            <p className="max-w-sm text-body text-muted-foreground">
              Registration, check-in and rewards all happen on your phone, and hosts
              see the same record you do.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            <StepTile
              n="01"
              icon={IconTicket}
              title="Pick a morning"
              body="Every event lists where to meet, how long it runs, and how many hands it still needs."
              className="lg:col-span-7"
            >
              <div className="w-full max-w-[340px] rotate-[-2deg] pb-10">
                <EventCard event={SAMPLE_EVENT} />
              </div>
            </StepTile>

            <StepTile
              n="02"
              icon={IconScan}
              title="Scan in on site"
              body="The host puts a QR code at the meeting point. One scan and your hours are on record."
              className="lg:col-span-5"
            >
              <CheckinPhone className="w-full max-w-[230px] pb-8" />
            </StepTile>

            <StepTile
              n="03"
              icon={IconSeal}
              title="Collect the stamp"
              body="Each event you finish is stamped into your passport, so your record builds visit by visit."
              className="lg:col-span-5"
            >
              <div className="relative flex h-[250px] w-full max-w-[360px] items-center justify-center">
                <div className="absolute left-0 top-4 w-[150px]">
                  <Stamp top="Juhu Beach" bottom="17 Oct 2026" icon={IconShore} ink="blue" rotate={-12} seed={2} fluid animate />
                </div>
                <div className="absolute right-2 top-0 w-[140px]">
                  <Stamp top="Aarey Colony" bottom="Plantation" icon={IconSapling} ink="green" rotate={9} seed={5} fluid animate delay={0.35} />
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <TextStamp text="Verified" sub="QR check-in" ink="orange" rotate={-5} animate delay={0.7} />
                </div>
              </div>
            </StepTile>

            <StepTile
              n="04"
              icon={IconToken}
              title="Spend your tokens"
              body={`${TOKENS_PER_ATTENDANCE} EcoTokens per check-in, traded in the shop for gear that keeps you coming back.`}
              className="lg:col-span-7"
            >
              <div className="w-full max-w-[480px] pb-8">
                <RewardsShelf compact />
              </div>
            </StepTile>
          </div>
        </Container>
      </section>

      {/* ── The work, as a page of stamps ────────────────────────────── */}
      <section className="border-y-2 border-dashed border-primary-900/15 bg-surface/60 py-section md:py-section-lg">
        <Container>
          <h2 className="max-w-3xl font-display text-mega">Six kinds of fieldwork</h2>
          <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_TYPE_LIST.map((t, i) => (
              <li key={t.id} className="group flex items-start gap-5">
                <div className="w-[104px] shrink-0 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                  <Stamp
                    top={t.plural}
                    bottom="Sproutify"
                    icon={t.icon}
                    ink={t.ink}
                    rotate={(i % 2 ? 1 : -1) * (5 + i)}
                    seed={i * 3 + 1}
                    fluid
                    animate
                    delay={i * 0.12}
                  />
                </div>
                <div className="pt-2">
                  <h3 className="text-h3 font-bold tracking-[-0.01em]">{t.plural}</h3>
                  <p className="mt-1.5 text-body text-muted-foreground">{WHAT_YOU_DO[t.id]}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Hosts ─────────────────────────────────────────────────────── */}
      <section className="py-section md:py-section-lg">
        <Container>
          <div className="grid items-center gap-12 overflow-hidden rounded-[28px] bg-primary-900 p-6 text-background sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary-100">
                <IconMegaphone size={16} />
                For hosts
              </p>
              <h2 className="mt-6 font-display text-mega">Running a cleanup? Host it here.</h2>
              <p className="mt-5 max-w-lg text-body-lg text-primary-100">
                NGOs, colleges and resident groups publish their own events, print a QR
                for the meeting point, and see who actually turned up.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: IconTicket, text: 'Publish an event with the details volunteers need' },
                  { icon: IconScan, text: 'Print a check-in QR for the meeting point' },
                  { icon: IconCrew, text: 'Watch arrivals land in real time on the day' },
                ].map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-body">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/10 text-stamp-subtle">
                      <f.icon size={22} />
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-10 h-12 rounded-full bg-stamp px-6 text-white hover:bg-stamp-ink">
                <Link href="/contact">
                  Become a host
                  <ArrowRight strokeWidth={2.25} />
                </Link>
              </Button>
            </div>
            <HostConsole />
          </div>
        </Container>
      </section>

      {/* ── Live events (renders nothing if the API is unavailable) ───── */}
      <UpcomingEvents />

      {/* ── Targets ───────────────────────────────────────────────────── */}
      <section className="pb-section md:pb-section-lg">
        <Container>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <h2 className="font-display text-mega">Where we’re headed by 2030</h2>
            <TextStamp text="Targets" sub="not results yet" ink="green" rotate={-4} />
          </div>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-[24px] border border-primary-900/12 bg-primary-900/12 sm:grid-cols-2 lg:grid-cols-4">
            {TARGETS.map((t) => (
              <div key={t.label} className="flex flex-col gap-6 bg-surface p-6 md:p-8">
                <t.icon size={34} className="text-primary-600" />
                <div>
                  <dd className="flex items-baseline gap-1.5 font-display text-[clamp(1.9rem,1.1rem+1.5vw,2.5rem)] leading-none text-foreground">
                    <CountUp value={t.value} />
                    {t.unit && <span className="font-mono text-base font-semibold normal-case text-muted-foreground">{t.unit}</span>}
                  </dd>
                  <dt className="mt-2 text-body text-muted-foreground">{t.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CtaPanel
        title={['Your passport', 'is still blank.']}
        body="Pick an event near you, turn up, and get your first stamp. It is free, and you only need a phone."
        primary={{ href: '/register', label: 'Get your passport' }}
        secondary={{ href: '/events', label: 'Browse events' }}
      />
    </>
  )
}
