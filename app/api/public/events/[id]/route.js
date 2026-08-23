export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

/**
 * PUBLIC single-event detail. Same allowlist discipline as the list route:
 * no qrCode, no creator identity, no registrant PII — only an aggregate count.
 */
export async function GET(request, { params }) {
  try {
    const prisma = await getPrisma()
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: {
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
      },
    })

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Public event fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
