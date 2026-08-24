import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { requireEventManager, forbidIfNotOwner } from '@/lib/admin-auth'
import { markAttendance, removeAttendance, AttendanceError } from '@/lib/attendance'

/**
 * A host can only mark attendance for events they created — checked via a
 * lightweight fetch of just `creatorId` rather than the full event record.
 */
async function requireOwnedEvent(request, eventId) {
  const auth = requireEventManager(request)
  if (auth instanceof NextResponse) throw new AttendanceError('Unauthorized', 401)

  const prisma = await getPrisma()
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { creatorId: true },
  })
  if (!event) throw new AttendanceError('Event not found', 404)

  const forbidden = forbidIfNotOwner(auth, event)
  if (forbidden) throw new AttendanceError('Forbidden', 403)

  return auth
}

export async function POST(request, { params }) {
  try {
    await requireOwnedEvent(request, params.id)

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
    }

    const { attendance, ecoTokens, tokensAwarded } = await markAttendance({
      userId,
      eventId: params.id,
    })

    return NextResponse.json(
      {
        message: `Attendance marked. ${tokensAwarded} EcoTokens awarded.`,
        attendance,
        ecoTokens,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AttendanceError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error('Mark attendance error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireOwnedEvent(request, params.id)

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
    }

    const { ecoTokens, tokensRevoked } = await removeAttendance({
      userId,
      eventId: params.id,
    })

    return NextResponse.json({
      message: `Attendance removed. ${tokensRevoked} EcoTokens revoked.`,
      ecoTokens,
    })
  } catch (error) {
    if (error instanceof AttendanceError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error('Remove attendance error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
