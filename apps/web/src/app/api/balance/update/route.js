import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/user/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const serviceSecret = request.headers.get('X-Service-Secret')

    if (serviceSecret !== process.env.SERVICE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, amount, transactionId } = await request.json()

    if (!userId || amount === undefined || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const INITIAL_BALANCE = 50000
    const currentBalance = user.intitial_balance
    const newBalance = currentBalance + amount

    if (newBalance < INITIAL_BALANCE) {
      return NextResponse.json(
        { error: 'Cannot redeem initial balance. Only earned funds can be redeemed.' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        intitial_balance: newBalance,
        updated_at: new Date(),
      },
    })

    return NextResponse.json(
      {
        success: true,
        newBalance: updatedUser.intitial_balance,
        transactionId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Balance update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
