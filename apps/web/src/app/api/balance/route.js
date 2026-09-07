import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaUser } from '@/lib/prisma/user'
import { prismaItems } from '@/lib/prisma/items'

// Demo credit economy — 1 credit is displayed 1:1, no fiat conversion.
// The authoritative balance lives in Postgres `users.initial_balance`.

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, initial_balance: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 })
    }

    const credits = Number(user.initial_balance ?? 0)

    // Spend / earn stats come from the items-domain transactions table.
    console.log('[API] balance: aggregating transactions for', user.id)
    const [spent, earned] = await Promise.all([
      prismaItems.transactions.aggregate({
        where: { buyer_id: user.id, payment_status: 'completed' },
        _sum: { amount: true },
      }),
      prismaItems.transactions.aggregate({
        where: {
          payment_status: 'completed',
          items: { is: { user_id: user.id } },
        },
        _sum: { amount: true },
      }),
    ])

    return NextResponse.json(
      {
        balance: { credits },
        stats: {
          totalSpent: Number(spent._sum.amount ?? 0),
          totalEarned: Number(earned._sum.amount ?? 0),
        },
        user: { id: user.id },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Get balance error:', error)
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL' }, { status: 500 })
  }
}
