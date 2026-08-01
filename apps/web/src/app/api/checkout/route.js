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
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. Parse request body
    const body = await request.json()
    const { packageType } = body

    if (!packageType || !PACKAGES[packageType]) {
      return NextResponse.json(
        { error: 'Invalid package type' },
        { status: 400 }
      )
    }

    const pkg = PACKAGES[packageType]

    // 4. Prepare Stripe session data
    // Note: In production, this would integrate with Stripe API
    // For now, we create a session reference to be confirmed later
    
    const checkoutSession = {
      id: `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      packageType,
      credits: pkg.credits,
      priceUSD: pkg.price,
      status: 'pending',
      created_at: new Date()
    }

    // 5. Store session reference in database
    // For now, we'll return session info - in production, use Stripe API
    // For development, store temporarily in memory/cache

    // 6. Return response
    return NextResponse.json(
      {
        session: {
          id: checkoutSession.id,
          packageType: pkg.name,
          credits: pkg.credits,
          price: pkg.price,
          currency: 'USD'
        },
        // In production, this would be a Stripe redirect URL
        redirectUrl: `/checkout/confirm?session=${checkoutSession.id}`,
        message: 'Checkout session created. Redirect to Stripe or confirm payment.'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create checkout session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
