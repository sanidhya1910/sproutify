import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { markAttendance, removeAttendance, AttendanceError } from '@/lib/attendance'

function requireAdmin(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    throw new AttendanceError('Unauthorized', 401)
  }
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'ADMIN') {
    throw new AttendanceError('Unauthorized', 401)
  }
  return decoded
}

export async function POST(request, { params }) {
  try {
    requireAdmin(request)

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
        message: `Attendance marked successfully — ${tokensAwarded} EcoTokens awarded`,
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
    requireAdmin(request)

    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
    }

    const { ecoTokens, tokensRevoked } = await removeAttendance({
      userId,
      eventId: params.id,
    })

    return NextResponse.json({
      message: `Attendance removed successfully — ${tokensRevoked} EcoTokens revoked`,
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
