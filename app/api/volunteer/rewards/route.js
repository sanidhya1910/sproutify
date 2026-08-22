import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const prisma = await getPrisma()
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'VOLUNTEER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { cost: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        cost: true,
        imageUrl: true,
        stock: true,
      },
    })

    return NextResponse.json(rewards)
  } catch (error) {
    console.error('Rewards fetch error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
