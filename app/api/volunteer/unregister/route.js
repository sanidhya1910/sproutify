import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function DELETE(request) {
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

    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Check if registration exists
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: eventId
        }
      }
    })

    if (!registration) {
      return NextResponse.json(
        { message: 'Not registered for this event' },
        { status: 400 }
      )
    }

    // Check if event is in the future
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (event && new Date(event.date) < new Date()) {
      return NextResponse.json(
        { message: 'Cannot unregister from past events' },
        { status: 400 }
      )
    }

    // Delete registration
    await prisma.eventRegistration.delete({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: eventId
        }
      }
    })

    return NextResponse.json({ 
      message: 'Successfully unregistered from event'
    })
  } catch (error) {
    console.error('Unregistration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}