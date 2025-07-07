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

    // Get all volunteers with their statistics
    const volunteers = await prisma.user.findMany({
      where: {
        role: 'VOLUNTEER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            eventRegistrations: true,
            attendances: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to include statistics
    const volunteersWithStats = volunteers.map(volunteer => ({
      ...volunteer,
      stats: {
        registeredEvents: volunteer._count.eventRegistrations,
        attendedEvents: volunteer._count.attendances
      }
    }))

    return NextResponse.json(volunteersWithStats)
  } catch (error) {
    console.error('Volunteers fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}