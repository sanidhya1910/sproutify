import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request, { params }) {
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

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: params.id }
    })

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user is registered for the event
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: params.id
        }
      }
    })

    if (!registration) {
      return NextResponse.json(
        { message: 'User is not registered for this event' },
        { status: 400 }
      )
    }

    // Check if attendance already exists
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: params.id
        }
      }
    })

    if (existingAttendance) {
      return NextResponse.json(
        { message: 'Attendance already marked for this user' },
        { status: 400 }
      )
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId: userId,
        eventId: params.id
      }
    })

    return NextResponse.json({ 
      message: 'Attendance marked successfully',
      attendance 
    }, { status: 201 })
  } catch (error) {
    console.error('Mark attendance error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
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

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if attendance exists
    const attendance = await prisma.attendance.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: params.id
        }
      }
    })

    if (!attendance) {
      return NextResponse.json(
        { message: 'Attendance record not found' },
        { status: 404 }
      )
    }

    // Delete attendance record
    await prisma.attendance.delete({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: params.id
        }
      }
    })

    return NextResponse.json({ 
      message: 'Attendance removed successfully'
    })
  } catch (error) {
    console.error('Remove attendance error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}