import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/db'

// Stripe credit packages (in credits)
const PACKAGES = {
  starter: { credits: 1000, price: 10, name: 'Starter' },
  pro: { credits: 5000, price: 40, name: 'Pro' },
  elite: { credits: 10000, price: 70, name: 'Elite' },
  ultimate: { credits: 25000, price: 150, name: 'Ultimate' }
}

export async function POST(request) {
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

    // 3. Parse request body
    const body = await request.json()
    const { sessionId, packageType, stripePaymentIntentId } = body

    if (!packageType || !PACKAGES[packageType]) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      )
    }

    const pkg = PACKAGES[packageType]
    const currentBalance = user.intitial_balance || 0
    const newBalance = currentBalance + pkg.credits

    // 4. Create transaction record
    const transaction = await prismaSocial.transactions.create({
      data: {
        buyer_id: user.id,
        seller_id: null, // Top-up has no seller
        item_id: null, // Top-up has no item
        amount: pkg.price, // Store USD amount
        payment_status: 'completed',
        transaction_date: new Date(),
        transaction_type: 'top-up',
        // Store payment info in metadata if available
        metadata: {
          stripePaymentIntentId,
          sessionId,
          creditsAdded: pkg.credits
        }
      }
    })

    // 5. Update user balance
    const updatedUser = await prismaSocial.users.update({
      where: { id: user.id },
      data: {
        intitial_balance: newBalance
      },
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

    // 6. Return response
    return NextResponse.json(
      {
        success: true,
        transaction: {
          id: transaction.transaction_id,
          type: 'top-up',
          packageName: pkg.name,
          creditsAdded: pkg.credits,
          priceUSD: pkg.price,
          status: 'completed',
          timestamp: transaction.transaction_date
        },
        balance: {
          credits: updatedUser.intitial_balance,
          usd: updatedUser.intitial_balance * 0.01
        },
        message: `Successfully added ${pkg.credits} credits to your account!`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Confirm checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
