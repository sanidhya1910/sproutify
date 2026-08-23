import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const prisma = await getPrisma()
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

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
