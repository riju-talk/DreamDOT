import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/user/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const serviceSecret = request.headers.get('X-Service-Secret')
    const serviceUserId = request.headers.get('X-User-Id')

    let userId

    if (serviceSecret === process.env.SERVICE_SECRET && serviceUserId) {
      userId = serviceUserId
    } else {
      const session = await getServerSession()
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.users.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      userId = user.id
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        intitial_balance: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const INITIAL_BALANCE = 50000
    const currentBalance = user.intitial_balance
    const redeemableBalance = Math.max(0, currentBalance - INITIAL_BALANCE)

    return NextResponse.json(
      {
        userId: user.id,
        currentBalance,
        initialBalance: INITIAL_BALANCE,
        redeemableBalance,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get balance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
