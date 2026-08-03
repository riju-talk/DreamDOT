import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/prisma/social'

const USD_CONVERSION_RATE = 0.01 // 1 credit = 0.01 USD

export async function GET(request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user and balance
    const user = await prismaSocial.users.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        intitial_balance: true,
        user_profile: {
          select: {
            display_name: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const balance = user.intitial_balance || 0

    // 3. Get total spent
    const totalSpentResult = await prismaSocial.transactions.aggregate({
      where: {
        buyer_id: user.id,
        payment_status: 'completed',
        transaction_type: {
          in: ['purchase', 'top-up'] // Include both purchases and actual top-ups
        }
      },
      _sum: {
        amount: true
      }
    })

    const totalSpent = Math.abs(parseFloat(totalSpentResult._sum.amount || 0))

    // 4. Get total earned (from sales)
    const totalEarnedResult = await prismaSocial.transactions.aggregate({
      where: {
        seller_id: user.id,
        payment_status: 'completed'
      },
      _sum: {
        amount: true
      }
    })

    const totalEarned = parseFloat(totalEarnedResult._sum.amount || 0)

    // 5. Get pending transactions (optional)
    const pendingCount = await prismaSocial.transactions.count({
      where: {
        $or: [
          { buyer_id: user.id },
          { seller_id: user.id }
        ],
        payment_status: 'pending'
      }
    })

    // 6. Format response
    return NextResponse.json(
      {
        balance: {
          credits: balance,
          usd: balance * USD_CONVERSION_RATE
        },
        stats: {
          totalSpent,
          totalEarned,
          pendingTransactions: pendingCount
        },
        conversionRate: USD_CONVERSION_RATE,
        user: {
          id: user.id,
          name: user.user_profile?.display_name || 'User'
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get balance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
