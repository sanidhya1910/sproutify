import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'VOLUNTEER') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get stats
    const [registeredEvents, attendedEvents, upcomingEventsCount, user] = await Promise.all([
      prisma.eventRegistration.count({
        where: {
          userId: decoded.userId
        }
      }),
      prisma.attendance.count({
        where: {
          userId: decoded.userId
        }
      }),
      prisma.eventRegistration.count({
        where: {
          userId: decoded.userId,
          event: {
            date: {
              gte: new Date()
            }
          }
        }
      }),
      prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { ecoTokens: true }
      })
    ])

    // Simple attendance-derived level: every 3 attended events levels a
    // volunteer up, with progress showing how far through the current level
    // they are. No separate model needed for this — it's fully derived.
    const EVENTS_PER_LEVEL = 3
    const volunteerLevel = 1 + Math.floor(attendedEvents / EVENTS_PER_LEVEL)
    const progress = Math.round(((attendedEvents % EVENTS_PER_LEVEL) / EVENTS_PER_LEVEL) * 100)

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date()
        },
        registrations: {
          some: {
            userId: decoded.userId
          }
        }
      },
      take: 5,
      orderBy: {
        date: 'asc'
      }
    })

    // Get recent events
    const recentEvents = await prisma.event.findMany({
      where: {
        date: {
          lt: new Date()
        },
        attendances: {
          some: {
            userId: decoded.userId
          }
        }
      },
      take: 5,
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({
      stats: {
        registeredEvents,
        attendedEvents,
        upcomingEvents: upcomingEventsCount
      },
      upcomingEvents,
      recentEvents,
      ecoTokens: user?.ecoTokens ?? 0,
      volunteerLevel,
      progress
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}