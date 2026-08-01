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

    // 2. Get user by email
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
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit')) || 12))
    const type = searchParams.get('type')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // 4. Build filter conditions
    const where = {
      buyer_id: user.id,
      payment_status: 'completed'
    }

    // Add category filter if provided
    if (type) {
      where.items = {
        category: type
      }
    }

    // Add date range filter if provided
    if (dateFrom || dateTo) {
      where.transaction_date = {}
      if (dateFrom) {
        where.transaction_date.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.transaction_date.lte = new Date(dateTo)
      }
    }

    // 5. Get total count for pagination
    const total = await prismaSocial.transactions.count({ where })

    // 6. Fetch transactions with pagination
    const transactions = await prismaSocial.transactions.findMany({
      where,
      include: {
        items: {
          include: {
            users: {
              select: {
                id: true,
                user_profile: {
                  select: {
                    display_name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { transaction_date: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // 7. Transform transactions to library items format
    const items = transactions.map(tx => ({
      id: tx.transaction_id,
      title: tx.items.title || 'Untitled',
      image: tx.items.description ? tx.items.description.substring(0, 50) : '',
      category: tx.items.category || 'other',
      purchaseDate: tx.transaction_date?.toISOString() || new Date().toISOString(),
      price: parseFloat(tx.amount),
      creatorName: tx.items.users?.user_profile?.display_name || 'Unknown Creator',
      creatorId: tx.items.user_id,
      status: 'purchased',
      accessLevel: 'full',
      metadata: {
        itemId: tx.items.item_id,
        monetizationType: tx.items.monetization_type
      }
    }))

    // 8. Calculate statistics
    const processingCount = await prismaSocial.transactions.count({
      where: {
        buyer_id: user.id,
        payment_status: 'pending'
      }
    })

    const stats = {
      purchased: total,
      processing: processingCount
    }

    // 9. Calculate total spent
    const totalSpentResult = await prismaSocial.transactions.aggregate({
      where: {
        buyer_id: user.id,
        payment_status: 'completed'
      },
      _sum: {
        amount: true
      }
    })

    const totalSpent = parseFloat(totalSpentResult._sum.amount || 0)

    // 10. Return response
    return NextResponse.json(
      {
        items,
        hasMore: (page - 1) * limit + items.length < total,
        total,
        totalSpent,
        stats
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get library error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
