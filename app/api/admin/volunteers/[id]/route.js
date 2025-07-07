import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request, { params }) {
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

    const volunteer = await prisma.user.findUnique({
      where: {
        id: params.id,
        role: 'VOLUNTEER'
      },
      include: {
        eventRegistrations: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                description: true,
                location: true,
                date: true,
                startTime: true,
                endTime: true
              }
            }
          },
          orderBy: {
            event: {
              date: 'desc'
            }
          }
        },
        attendances: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                location: true,
                date: true
              }
            }
          },
          orderBy: {
            event: {
              date: 'desc'
            }
          }
        },
        _count: {
          select: {
            eventRegistrations: true,
            attendances: true
          }
        }
      }
    })

    if (!volunteer) {
      return NextResponse.json(
        { message: 'Volunteer not found' },
        { status: 404 }
      )
    }

    // Transform the data to include statistics
    const volunteerWithStats = {
      ...volunteer,
      stats: {
        registeredEvents: volunteer._count.eventRegistrations,
        attendedEvents: volunteer._count.attendances
      },
      registrations: volunteer.eventRegistrations,
      attendances: volunteer.attendances
    }

    // Remove the _count field as we've transformed it to stats
    delete volunteerWithStats._count
    delete volunteerWithStats.eventRegistrations

    return NextResponse.json(volunteerWithStats)
  } catch (error) {
    console.error('Volunteer fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}