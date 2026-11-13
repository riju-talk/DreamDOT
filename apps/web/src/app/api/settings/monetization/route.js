import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { User } from '@repo/database-mongo'

const DEFAULT_MONTHLY = 500
const DEFAULT_ANNUAL = 5000

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findById(session.user.id).lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      monthlyPriceCredits: user.monetization?.defaultMonthlyCredits ?? DEFAULT_MONTHLY,
      annualPriceCredits: user.monetization?.defaultAnnualCredits ?? DEFAULT_ANNUAL,
    })
  } catch (err) {
    console.error('[GET /api/settings/monetization] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch monetization settings' }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const monthlyPriceCredits = Math.max(0, Math.floor(Number(body.monthlyPriceCredits) || 0))
    const annualPriceCredits = Math.max(0, Math.floor(Number(body.annualPriceCredits) || 0))

    await connectToDatabase()
    await User.findByIdAndUpdate(session.user.id, {
      $set: {
        monetization: {
          defaultMonthlyCredits: monthlyPriceCredits,
          defaultAnnualCredits: annualPriceCredits,
        },
      },
    })

    return NextResponse.json({
      success: true,
      monthlyPriceCredits,
      annualPriceCredits,
    })
  } catch (err) {
    console.error('[PUT /api/settings/monetization] Error:', err)
    return NextResponse.json({ error: 'Failed to update monetization settings' }, { status: 500 })
  }
}
