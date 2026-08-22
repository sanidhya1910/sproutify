import { prisma } from '@/lib/prisma'
import { TOKENS_PER_ATTENDANCE } from '@/lib/constants'

// Shared attendance + EcoToken-award logic, used by both the admin
// "Mark Present" flow (app/api/admin/events/[id]/attendance) and the
// volunteer QR self-check-in flow (app/api/checkin/[eventId]) so the two
// paths can never drift out of sync on how tokens are earned/revoked.

export class AttendanceError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'AttendanceError'
    this.status = status
  }
}

/**
 * Marks a volunteer as attended for an event and awards EcoTokens.
 * Idempotent: attempting to mark attendance twice throws a 400 rather than
 * double-awarding — the underlying unique constraint on
 * Attendance[userId, eventId] is the real backstop.
 */
export async function markAttendance({ userId, eventId }) {
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) {
    throw new AttendanceError('Event not found', 404)
  }

  const registration = await prisma.eventRegistration.findUnique({
    where: { userId_eventId: { userId, eventId } },
  })
  if (!registration) {
    throw new AttendanceError('User is not registered for this event', 400)
  }

  const existingAttendance = await prisma.attendance.findUnique({
    where: { userId_eventId: { userId, eventId } },
  })
  if (existingAttendance) {
    throw new AttendanceError('Attendance already marked for this user', 400)
  }

  try {
    const [attendance, user] = await prisma.$transaction([
      prisma.attendance.create({ data: { userId, eventId } }),
      prisma.user.update({
        where: { id: userId },
        data: { ecoTokens: { increment: TOKENS_PER_ATTENDANCE } },
        select: { ecoTokens: true },
      }),
    ])
    return { attendance, ecoTokens: user.ecoTokens, tokensAwarded: TOKENS_PER_ATTENDANCE }
  } catch (error) {
    // Unique-constraint race (two simultaneous check-ins) — treat as "already marked".
    if (error?.code === 'P2002') {
      throw new AttendanceError('Attendance already marked for this user', 400)
    }
    throw error
  }
}

/**
 * Removes a previously-marked attendance and revokes the EcoTokens that were
 * awarded for it, floored at zero so an admin undoing a mis-click can never
 * push a volunteer's balance negative.
 */
export async function removeAttendance({ userId, eventId }) {
  const attendance = await prisma.attendance.findUnique({
    where: { userId_eventId: { userId, eventId } },
  })
  if (!attendance) {
    throw new AttendanceError('Attendance record not found', 404)
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { ecoTokens: true } })
  const revokedAmount = Math.min(TOKENS_PER_ATTENDANCE, user?.ecoTokens ?? 0)

  const [, updatedUser] = await prisma.$transaction([
    prisma.attendance.delete({ where: { userId_eventId: { userId, eventId } } }),
    prisma.user.update({
      where: { id: userId },
      data: { ecoTokens: { decrement: revokedAmount } },
      select: { ecoTokens: true },
    }),
  ])

  return { ecoTokens: updatedUser.ecoTokens, tokensRevoked: revokedAmount }
}
