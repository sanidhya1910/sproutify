export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function requireAdmin(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'ADMIN') return null
  return decoded
}

// Reads submissions from the public contact form, closing the loop on
// messages that previously had nowhere to go.
export async function GET(request) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const prisma = await getPrisma()
    const messages = await prisma.contactMessage.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: 100,
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { id, status } = await request.json()
    if (!id || !['NEW', 'READ', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ message: 'id and a valid status are required' }, { status: 400 })
    }
    const prisma = await getPrisma()
    const updated = await prisma.contactMessage.update({ where: { id }, data: { status } })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Message update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
