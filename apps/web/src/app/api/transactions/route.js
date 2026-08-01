import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/db'

export async function GET(request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user
    const user = await prismaSocial.users.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit')) || 20))
    const type = searchParams.get('type') // 'all', 'income', 'expense'
    const sortBy = searchParams.get('sortBy') || 'date-desc' // 'date-asc', 'date-desc', 'amount-asc', 'amount-desc'

    // 4. Build filter conditions
    let where = {
      $or: [
        { buyer_id: user.id },
        { seller_id: user.id }
      ]
    }

    // Filter by type
    if (type === 'income') {
      where = { seller_id: user.id, payment_status: 'completed' }
    } else if (type === 'expense') {
      where = { buyer_id: user.id, payment_status: 'completed' }
    } else {
      where.payment_status = 'completed'
    }

    // 5. Get total count
    const total = await prismaSocial.transactions.count({ where })

    // 6. Determine sort order
    let orderBy = { transaction_date: 'desc' }
    if (sortBy === 'date-asc') orderBy = { transaction_date: 'asc' }
    else if (sortBy === 'amount-asc') orderBy = { amount: 'asc' }
    else if (sortBy === 'amount-desc') orderBy = { amount: 'desc' }

    // 7. Fetch transactions
    const skip = (page - 1) * limit
    const transactions = await prismaSocial.transactions.findMany({
      where,
      include: {
        items: {
          select: {
            title: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // 8. Enrich transactions with metadata
    const enrichedTransactions = await Promise.all(
      transactions.map(async (tx) => {
        const isIncome = tx.seller_id === user.id
        const otherUserId = isIncome ? tx.buyer_id : tx.seller_id
        
        const otherUser = await prismaSocial.users.findUnique({
          where: { id: otherUserId },
          select: {
            user_profile: {
              select: {
                display_name: true,
                avatar_url: true
              }
            }
          }
        })

        return {
          id: tx.transaction_id,
          type: isIncome ? 'income' : 'expense',
          itemTitle: tx.items?.title || 'Transaction',
          amount: tx.amount,
          amountDisplay: isIncome ? `+${tx.amount}` : `-${tx.amount}`,
          status: tx.payment_status,
          timestamp: tx.transaction_date,
          otherUser: {
            id: otherUserId,
            name: otherUser?.user_profile?.display_name || 'Unknown User',
            avatar: otherUser?.user_profile?.avatar_url || null
          },
          category: tx.transaction_type || 'purchase'
        }
      })
    )

    // 9. Calculate summary stats
    const incomeResult = await prismaSocial.transactions.aggregate({
      where: { seller_id: user.id, payment_status: 'completed' },
      _sum: { amount: true }
    })

    const expenseResult = await prismaSocial.transactions.aggregate({
      where: { buyer_id: user.id, payment_status: 'completed' },
      _sum: { amount: true }
    })

    const stats = {
      totalIncome: parseFloat(incomeResult._sum.amount || 0),
      totalExpense: parseFloat(expenseResult._sum.amount || 0)
    }

    // 10. Return response
    return NextResponse.json(
      {
        transactions: enrichedTransactions,
        hasMore: skip + enrichedTransactions.length < total,
        total,
        page,
        limit,
        stats
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
