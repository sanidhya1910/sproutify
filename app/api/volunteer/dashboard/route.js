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
    const [registeredEvents, attendedEvents, upcomingEventsCount] = await Promise.all([
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
      })
    ])

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
      recentEvents
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}