import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request) {
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

    const { rewardId } = await request.json()
    if (!rewardId) {
      return NextResponse.json({ message: 'rewardId is required' }, { status: 400 })
    }

    const reward = await prisma.reward.findUnique({ where: { id: rewardId } })
    if (!reward || !reward.isActive) {
      return NextResponse.json({ message: 'Reward not found' }, { status: 404 })
    }
    if (reward.stock != null && reward.stock <= 0) {
      return NextResponse.json({ message: 'This reward is out of stock' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { ecoTokens: true },
    })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    // Never trust the client's disabled-button state — re-check server-side.
    if (user.ecoTokens < reward.cost) {
      return NextResponse.json({ message: 'Not enough EcoTokens for this reward' }, { status: 400 })
    }

    const [redemption, updatedUser] = await prisma.$transaction([
      prisma.redemption.create({
        data: {
          userId: decoded.userId,
          rewardId: reward.id,
          tokensSpent: reward.cost,
        },
      }),
      prisma.user.update({
        where: { id: decoded.userId },
        data: { ecoTokens: { decrement: reward.cost } },
        select: { ecoTokens: true },
      }),
      ...(reward.stock != null
        ? [prisma.reward.update({ where: { id: reward.id }, data: { stock: { decrement: 1 } } })]
        : []),
    ])

    return NextResponse.json(
      {
        message: `Redeemed ${reward.name}!`,
        redemption,
        ecoTokens: updatedUser.ecoTokens,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Redeem error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
