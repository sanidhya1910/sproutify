export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

/**
 * PUBLIC, unauthenticated event listing.
 *
 * Until now no such endpoint existed — the only listings were VOLUNTEER- and
 * ADMIN-gated, which is why the public /events page shipped a hardcoded
 * demoEvents array instead of real data, and why /events/[id] called an
 * ADMIN endpoint and 403'd for every anonymous visitor.
 *
 * The `select` is a deliberate allowlist. It must never include `qrCode`
 * (that token is what authorises a check-in), `creatorId`, or anything from
 * `registrations` beyond a count. An earlier version of this app leaked
 * registrant names and emails from an admin route whose auth check had been
 * commented out; an explicit projection is how that stays impossible here.
 */
const PUBLIC_EVENT_FIELDS = {
  id: true,
  title: true,
  description: true,
  location: true,
  date: true,
  startTime: true,
  endTime: true,
  type: true,
  imageUrl: true,
  isFeatured: true,
  expectedVolunteers: true,
  safetyInstructions: true,
  _count: { select: { registrations: true } },
}

export async function GET(request) {
  try {
    const prisma = await getPrisma()
    const { searchParams } = new URL(request.url)
    const scope = searchParams.get('scope') // 'upcoming' (default) | 'past' | 'all'
    const now = new Date()

    let dateFilter
    if (scope === 'past') dateFilter = { lt: now }
    else if (scope === 'all') dateFilter = undefined
    else dateFilter = { gte: now }

    const events = await prisma.event.findMany({
      where: dateFilter ? { date: dateFilter } : undefined,
      orderBy: { date: scope === 'past' ? 'desc' : 'asc' },
      take: 60,
      select: PUBLIC_EVENT_FIELDS,
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Public events fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
