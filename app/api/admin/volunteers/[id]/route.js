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

// Promotes a volunteer to ADMIN. This is the sanctioned replacement for the
// self-service "sign up as admin" option removed from /register — the only
// way to create a new admin account now is for an existing admin to
// deliberately promote someone through this endpoint.
export async function PATCH(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await request.json()
    if (role !== 'ADMIN' && role !== 'VOLUNTEER') {
      return NextResponse.json({ message: 'role must be ADMIN or VOLUNTEER' }, { status: 400 })
    }

    if (params.id === decoded.userId) {
      return NextResponse.json({ message: "You can't change your own role" }, { status: 400 })
    }

    const target = await prisma.user.findUnique({ where: { id: params.id } })
    if (!target) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ message: `${updated.name} is now ${role === 'ADMIN' ? 'an admin' : 'a volunteer'}`, user: updated })
  } catch (error) {
    console.error('Volunteer role update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}