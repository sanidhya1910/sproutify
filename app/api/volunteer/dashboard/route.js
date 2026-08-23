import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { TOKENS_PER_ATTENDANCE } from '@/lib/constants'

const EVENTS_PER_LEVEL = 3

export async function GET(request) {
  try {
    const prisma = await getPrisma()
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'VOLUNTEER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const [
      registeredEvents,
      attendedEvents,
      upcomingEventsCount,
      user,
      attendedThisMonth,
      upcomingThisWeek,
    ] = await Promise.all([
      prisma.eventRegistration.count({ where: { userId: decoded.userId } }),
      prisma.attendance.count({ where: { userId: decoded.userId } }),
      prisma.eventRegistration.count({
        where: { userId: decoded.userId, event: { date: { gte: now } } },
      }),
      prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { ecoTokens: true, name: true, createdAt: true },
      }),
      // Real period deltas. The previous dashboard rendered "+8 this month",
      // "2 this week" and "+25 today" as hardcoded strings regardless of the
      // actual data — these are derived, and anything that cannot be derived
      // honestly is simply not returned.
      prisma.attendance.count({
        where: { userId: decoded.userId, checkedInAt: { gte: startOfMonth } },
      }),
      prisma.eventRegistration.count({
        where: {
          userId: decoded.userId,
          event: { date: { gte: now, lte: inSevenDays } },
        },
      }),
    ])

    const volunteerLevel = 1 + Math.floor(attendedEvents / EVENTS_PER_LEVEL)
    const progress = Math.round(((attendedEvents % EVENTS_PER_LEVEL) / EVENTS_PER_LEVEL) * 100)
    const eventsToNextLevel = EVENTS_PER_LEVEL - (attendedEvents % EVENTS_PER_LEVEL)

    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: { gte: now },
        registrations: { some: { userId: decoded.userId } },
      },
      take: 5,
      orderBy: { date: 'asc' },
      select: {
        id: true,
        title: true,
        location: true,
        date: true,
        startTime: true,
        endTime: true,
        type: true,
        imageUrl: true,
      },
    })

    const recentAttendances = await prisma.attendance.findMany({
      where: { userId: decoded.userId },
      take: 5,
      orderBy: { checkedInAt: 'desc' },
      select: {
        checkedInAt: true,
        event: {
          select: { id: true, title: true, location: true, date: true, type: true },
        },
      },
    })

    return NextResponse.json({
      user: { name: user?.name ?? 'Volunteer', memberSince: user?.createdAt ?? null },
      stats: {
        registeredEvents,
        attendedEvents,
        upcomingEvents: upcomingEventsCount,
      },
      deltas: {
        // Only surfaced when non-zero; the UI omits the chip otherwise.
        attendedThisMonth,
        upcomingThisWeek,
        tokensThisMonth: attendedThisMonth * TOKENS_PER_ATTENDANCE,
      },
      upcomingEvents,
      recentAttendances,
      ecoTokens: user?.ecoTokens ?? 0,
      volunteerLevel,
      progress,
      eventsToNextLevel,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
