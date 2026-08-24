import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { requireEventManager } from '@/lib/admin-auth'

/**
 * ADMIN sees platform-wide numbers. ORGANIZER (a host) sees the same shape
 * scoped to events they created — "Volunteers" becomes "volunteers who
 * registered for your events" rather than every volunteer on the platform,
 * "Top volunteers" ranks by attendance at your events specifically rather
 * than sitewide, and the contact inbox count is always 0 since that surface
 * stays admin-only.
 */
export async function GET(request) {
  try {
    const prisma = await getPrisma()
    const auth = requireEventManager(request)
    if (auth instanceof NextResponse) return auth

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const eventScope = auth.isHost ? { creatorId: auth.decoded.userId } : {}

    if (auth.isHost) {
      const [totalEvents, activeEvents, totalAttendance, eventsThisMonth, attendanceThisMonth] =
        await Promise.all([
          prisma.event.count({ where: eventScope }),
          prisma.event.count({ where: { ...eventScope, date: { gte: now } } }),
          prisma.attendance.count({ where: { event: eventScope } }),
          prisma.event.count({ where: { ...eventScope, createdAt: { gte: startOfMonth } } }),
          prisma.attendance.count({
            where: { event: eventScope, checkedInAt: { gte: startOfMonth } },
          }),
        ])

      // Distinct volunteers who have ever registered for one of this host's
      // events. Prisma has no distinct-count-over-relation, so pull the ids
      // and dedupe in code — fine at this scale.
      const registrations = await prisma.eventRegistration.findMany({
        where: { event: eventScope },
        select: { userId: true, createdAt: true },
      })
      const totalVolunteers = new Set(registrations.map((r) => r.userId)).size
      const volunteersThisMonth = new Set(
        registrations.filter((r) => r.createdAt >= startOfMonth).map((r) => r.userId)
      ).size

      const recentEvents = await prisma.event.findMany({
        where: eventScope,
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          location: true,
          date: true,
          startTime: true,
          endTime: true,
          type: true,
          _count: { select: { registrations: true, attendances: true } },
        },
      })

      // Top volunteers by attendance AT THIS HOST'S EVENTS. Prisma can't
      // order by a filtered relation count, so this ranks in application
      // code instead of SQL — same principle as the platform dashboard
      // (never disagree with the number shown), just computed differently.
      const hostAttendances = await prisma.attendance.findMany({
        where: { event: eventScope },
        select: { userId: true },
      })
      const attendanceCounts = new Map()
      for (const a of hostAttendances) {
        attendanceCounts.set(a.userId, (attendanceCounts.get(a.userId) ?? 0) + 1)
      }
      const topIds = [...attendanceCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id)
      const topUsers = topIds.length
        ? await prisma.user.findMany({
            where: { id: { in: topIds } },
            select: { id: true, name: true, email: true, ecoTokens: true },
          })
        : []
      const registrationCounts = new Map()
      for (const r of registrations) {
        registrationCounts.set(r.userId, (registrationCounts.get(r.userId) ?? 0) + 1)
      }
      const topVolunteers = topIds.map((id) => {
        const user = topUsers.find((u) => u.id === id)
        return {
          ...user,
          _count: {
            attendances: attendanceCounts.get(id) ?? 0,
            eventRegistrations: registrationCounts.get(id) ?? 0,
          },
        }
      })

      return NextResponse.json({
        stats: { totalEvents, activeEvents, totalVolunteers, totalAttendance },
        deltas: { eventsThisMonth, volunteersThisMonth, attendanceThisMonth },
        newMessages: 0,
        recentEvents,
        topVolunteers,
      })
    }

    const [
      totalEvents,
      activeEvents,
      totalVolunteers,
      totalAttendance,
      eventsThisMonth,
      volunteersThisMonth,
      attendanceThisMonth,
      newMessages,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { date: { gte: now } } }),
      prisma.user.count({ where: { role: 'VOLUNTEER' } }),
      prisma.attendance.count(),
      // Real trends. The previous dashboard hardcoded "+15% this month" on
      // the volunteers card and computed a `trend` field it then never used.
      prisma.event.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { role: 'VOLUNTEER', createdAt: { gte: startOfMonth } } }),
      prisma.attendance.count({ where: { checkedInAt: { gte: startOfMonth } } }),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
    ])

    const recentEvents = await prisma.event.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        location: true,
        date: true,
        startTime: true,
        endTime: true,
        type: true,
        _count: { select: { registrations: true, attendances: true } },
      },
    })

    // Top volunteers by attendance. Ordering happens in SQL via the relation
    // count so it can't disagree with the number displayed.
    const topVolunteers = await prisma.user.findMany({
      where: { role: 'VOLUNTEER' },
      take: 5,
      orderBy: { attendances: { _count: 'desc' } },
      select: {
        id: true,
        name: true,
        email: true,
        ecoTokens: true,
        _count: { select: { attendances: true, eventRegistrations: true } },
      },
    })

    return NextResponse.json({
      stats: { totalEvents, activeEvents, totalVolunteers, totalAttendance },
      deltas: {
        eventsThisMonth,
        volunteersThisMonth,
        attendanceThisMonth,
      },
      newMessages,
      recentEvents,
      topVolunteers: topVolunteers.filter((v) => v._count.attendances > 0),
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
