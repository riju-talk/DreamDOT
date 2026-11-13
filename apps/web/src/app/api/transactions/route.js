import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaItems } from '@/lib/prisma/items'

/**
 * GET /api/transactions?page=&limit=&type=all|income|expense
 * Returns the current user's credit transactions (purchases they made,
 * sales of their items, and top-ups).
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const user = await prismaItems.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 })
    }

    const sp = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(sp.get('page')) || 1)
    const limit = Math.max(1, Math.min(100, parseInt(sp.get('limit')) || 20))
    const type = sp.get('type') || 'all'
    const skip = (page - 1) * limit

    // "income" = someone bought one of my items; "expense" = I bought / topped up.
    const mine = { buyer_id: user.id, payment_status: 'completed' }
    const sales = { items: { is: { user_id: user.id } }, payment_status: 'completed' }
    const where =
      type === 'income' ? sales : type === 'expense' ? mine : { OR: [mine, sales] }

    console.log('[API] transactions: query for', user.id, 'type', type)

    const [total, rows] = await Promise.all([
      prismaItems.transactions.count({ where }),
      prismaItems.transactions.findMany({
        where,
        include: { items: { select: { title: true, user_id: true } } },
        orderBy: { transaction_date: 'desc' },
        skip,
        take: limit,
      }),
    ])

    const transactions = rows.map((tx) => {
      const isIncome = tx.items?.user_id === user.id && tx.buyer_id !== user.id
      const amount = Number(tx.amount ?? 0)
      return {
        id: tx.transaction_id,
        type: tx.kind === 'topup' ? 'topup' : isIncome ? 'income' : 'expense',
        itemTitle: tx.kind === 'topup' ? 'Credit top-up' : tx.items?.title || 'Transaction',
        amount,
        amountDisplay: isIncome || tx.kind === 'topup' ? `+${amount}` : `-${amount}`,
        status: tx.payment_status,
        timestamp: tx.transaction_date,
      }
    })

    const [spent, earned, topped] = await Promise.all([
      prismaItems.transactions.aggregate({
        where: { buyer_id: user.id, kind: 'purchase', payment_status: 'completed' },
        _sum: { amount: true },
      }),
      prismaItems.transactions.aggregate({ where: sales, _sum: { amount: true } }),
      prismaItems.transactions.aggregate({
        where: { buyer_id: user.id, kind: 'topup', payment_status: 'completed' },
        _sum: { amount: true },
      }),
    ])

    return NextResponse.json(
      {
        transactions,
        hasMore: skip + transactions.length < total,
        total,
        page,
        limit,
        stats: {
          totalSpent: Number(spent._sum.amount ?? 0),
          totalEarned: Number(earned._sum.amount ?? 0),
          totalToppedUp: Number(topped._sum.amount ?? 0),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Get transactions error:', error)
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL' }, { status: 500 })
  }
}
