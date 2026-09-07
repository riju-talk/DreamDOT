import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaItems } from '@/lib/prisma/items'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { sendNotification } from '@/lib/notifications'
import { recordLedger } from '@/lib/web3'

export async function POST(request, { params }) {
  try {
    const { id: itemId } = await params

    // 1. Authenticate user
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user
    const user = await prismaItems.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, initial_balance: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // 3. Connect to MongoDB
    await connectToDatabase()

    // 4. Get item details - primary key is the PostgreSQL UUID (sqlId), fall back to Mongo _id
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(itemId)
    let item = await Item.findOne({ sqlId: itemId }).lean()
    if (!item && isObjectId) {
      item = await Item.findById(itemId).lean()
    }
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const sqlItemId = item.sqlId || null

    if (!sqlItemId) {
      return NextResponse.json({ error: 'Item is not linked to the purchase system' }, { status: 400 })
    }

    if (item.visibility !== 'public') {
      return NextResponse.json({ error: 'Item not available' }, { status: 403 })
    }

    // 5. Check if already purchased
    const existingTransaction = await prismaItems.transactions.findFirst({
      where: {
        buyer_id: user.id,
        item_id: sqlItemId,
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
    const userBalance = user.initial_balance || 0
    if (userBalance < item.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 402 }
      )
    }

    // 7. Create transaction
    const transaction = await prismaItems.transactions.create({
      data: {
        buyer_id: user.id,
        item_id: sqlItemId,
        amount: item.price,
        payment_status: 'completed',
        transaction_date: new Date()
      }
    })

    // 8. Update user balance
    const updatedUser = await prismaItems.users.update({
      where: { id: user.id },
      data: {
        initial_balance: userBalance - item.price
      },
      select: { initial_balance: true }
    })

    // 9. Add to Item purchases array (MongoDB)
    await Item.findByIdAndUpdate(
      item._id,
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

    // 9b. Best-effort on-chain record of the purchase — never blocks the response.
    recordLedger({
      kind: 'purchase',
      userId: user.id,
      itemId: sqlItemId,
      amount: item.price,
      ref: transaction.transaction_id,
    }).catch((err) => console.error('[API] purchase ledger record failed:', err.message))

    // 10. Get seller info for notification
    const seller = await prismaItems.users.findUnique({
      where: { id: item.userId },
      select: {
        user_profile: {
          select: {
            display_name: true
          }
        }
      }
    })

    // Notify the seller — fire-and-forget, never blocks the response. Skip
    // self-notification in the (defensive) case a creator "buys" their own item.
    if (item.userId !== user.id) {
      const buyerName = session.user.name || session.user.email || 'Someone'
      sendNotification(item.userId, 'item_purchase', `${buyerName} purchased "${item.title}"`).catch((err) =>
        console.error('[API] Failed to dispatch purchase notification:', err.message)
      )
    }

    return NextResponse.json(
      {
        success: true,
        transaction: {
          id: transaction.transaction_id,
          itemId: sqlItemId,
          itemTitle: item.title,
          amount: item.price,
          status: 'completed',
          timestamp: transaction.transaction_date
        },
        newBalance: updatedUser.initial_balance,
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
