import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { markAttendance, AttendanceError } from '@/lib/attendance'

function requireVolunteer(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    throw new AttendanceError('Unauthorized', 401)
  }
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'VOLUNTEER') {
    throw new AttendanceError('Unauthorized', 401)
  }
  return decoded
}

// The URL param is the event's dedicated `qrCode` token (a random uuid,
// decoupled from its primary-key `id`) — not the event id itself — so a
// leaked/printed QR code can be rotated without touching the event record.
async function resolveEvent(qrCode) {
  const prisma = await getPrisma()
  const event = await prisma.event.findUnique({
    where: { qrCode },
    select: { id: true, title: true, location: true, date: true, startTime: true, endTime: true },
  })
  if (!event) {
    throw new AttendanceError('Invalid or expired check-in link', 404)
  }
  return event
}

// GET — used by the /checkin/[qrCode] page to show the volunteer what
// they're about to check into before they confirm.
export async function GET(request, { params }) {
  try {
    const prisma = await getPrisma()
    const decoded = requireVolunteer(request)
    const event = await resolveEvent(params.qrCode)

    const [registration, attendance] = await Promise.all([
      prisma.eventRegistration.findUnique({
        where: { userId_eventId: { userId: decoded.userId, eventId: event.id } },
      }),
      prisma.attendance.findUnique({
        where: { userId_eventId: { userId: decoded.userId, eventId: event.id } },
      }),
    ])

    return NextResponse.json({
      event,
      isRegistered: !!registration,
      alreadyCheckedIn: !!attendance,
    })
  } catch (error) {
    if (error instanceof AttendanceError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error('Check-in lookup error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// POST — self-service check-in. A volunteer scans (or opens) an event's QR
// link and confirms; this records the same Attendance row and awards the
// same EcoTokens an admin's manual "Mark Present" would.
export async function POST(request, { params }) {
  try {
    const decoded = requireVolunteer(request)
    const event = await resolveEvent(params.qrCode)

    const { attendance, ecoTokens, tokensAwarded } = await markAttendance({
      userId: decoded.userId,
      eventId: event.id,
    })

    return NextResponse.json(
      {
        message: `Checked in — ${tokensAwarded} EcoTokens awarded`,
        attendance,
        ecoTokens,
        tokensAwarded,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AttendanceError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error('Self check-in error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
