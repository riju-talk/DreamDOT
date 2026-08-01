import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/db'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

export async function POST(request, { params }) {
  try {
    // 1. Authenticate user
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user
    const user = await prismaSocial.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, intitial_balance: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const itemId = params.id
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // 3. Connect to MongoDB
    await connectToDatabase()

    // 4. Get item details
    const item = await Item.findById(itemId).lean()
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.visibility !== 'public') {
      return NextResponse.json({ error: 'Item not available' }, { status: 403 })
    }

    // 5. Check if already purchased
    const existingTransaction = await prismaSocial.transactions.findFirst({
      where: {
        buyer_id: user.id,
        item_id: itemId,
        payment_status: 'completed'
      }
    })

    if (existingTransaction) {
      return NextResponse.json(
        { error: 'Already purchased' },
        { status: 409 }
      )
    }

    // 6. Check user balance
    const userBalance = user.intitial_balance || 0
    if (userBalance < item.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 402 }
      )
    }

    // 7. Create transaction
    const transaction = await prismaSocial.transactions.create({
      data: {
        buyer_id: user.id,
        seller_id: item.userId,
        item_id: itemId,
        amount: item.price,
        payment_status: 'completed',
        transaction_date: new Date(),
        transaction_type: 'purchase'
      }
    })

    // 8. Update user balance
    const updatedUser = await prismaSocial.users.update({
      where: { id: user.id },
      data: {
        intitial_balance: userBalance - item.price
      },
      select: { intitial_balance: true }
    })

    // 9. Add to Item purchases array (MongoDB)
    await Item.findByIdAndUpdate(
      itemId,
      {
        $push: {
          purchases: {
            buyerId: user.id,
            purchaseDate: new Date(),
            transactionId: transaction.transaction_id
          }
        },
        $inc: { sales: 1 }
      }
    )

    // 10. Get seller info for notification (optional)
    const seller = await prismaSocial.users.findUnique({
      where: { id: item.userId },
      select: {
        user_profile: {
          select: {
            display_name: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        success: true,
        transaction: {
          id: transaction.transaction_id,
          itemId: itemId,
          itemTitle: item.title,
          amount: item.price,
          status: 'completed',
          timestamp: transaction.transaction_date
        },
        newBalance: updatedUser.intitial_balance,
        seller: {
          id: item.userId,
          name: seller?.user_profile?.display_name || 'Creator'
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Purchase item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
