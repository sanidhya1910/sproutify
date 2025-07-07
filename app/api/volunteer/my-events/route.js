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

    // Get all events the user is registered for
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        event: {
          include: {
            creator: {
              select: {
                name: true,
                email: true
              }
            },
            _count: {
              select: {
                registrations: true,
                attendances: true
              }
            }
          }
        }
      },
      orderBy: {
        event: {
          date: 'desc'
        }
      }
    })

    // Get attendance records for the user
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: decoded.userId
      },
      select: {
        eventId: true
      }
    })

    const attendanceEventIds = new Set(attendances.map(a => a.eventId))

    // Transform the data to include attendance information
    const events = registrations.map(registration => ({
      ...registration.event,
      attendances: attendanceEventIds.has(registration.event.id) ? [{ userId: decoded.userId }] : []
    }))

    return NextResponse.json(events)
  } catch (error) {
    console.error('My events fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}