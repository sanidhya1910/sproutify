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
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get stats
    const [totalEvents, activeEvents, totalVolunteers, totalAttendance] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({
        where: {
          date: {
            gte: new Date()
          }
        }
      }),
      prisma.user.count({
        where: {
          role: 'VOLUNTEER'
        }
      }),
      prisma.attendance.count()
    ])

    // Get recent events
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            registrations: true,
            attendances: true
          }
        }
      }
    })

    return NextResponse.json({
      stats: {
        totalEvents,
        activeEvents,
        totalVolunteers,
        totalAttendance
      },
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