import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaItems } from '@/lib/prisma/items'
import { recordLedger } from '@/lib/web3'

const MAX_TOPUP = 100000

/**
 * POST /api/balance/topup
 * Body: { amount: number, review?: { rating?: number, text?: string } }
 *
 * Demo credit economy: there is no payment. Topping up simply increases the
 * account's credit balance. The user may optionally leave a review — the idea
 * being "if this were a paid product, this is the feedback you'd leave when buying
 * credits". The review is stored as a platform-level review (no item attached).
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const amount = Number(body?.amount)
    const review = body?.review

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive number', code: 'INVALID_AMOUNT' },
        { status: 400 }
      )
    }
    if (amount > MAX_TOPUP) {
      return NextResponse.json(
        { error: `amount cannot exceed ${MAX_TOPUP}`, code: 'AMOUNT_TOO_LARGE' },
        { status: 400 }
      )
    }

    const user = await prismaItems.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, initial_balance: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 404 })
    }

    console.log('[API] topup: crediting', amount, 'to', user.id)

    const updated = await prismaItems.users.update({
      where: { id: user.id },
      data: { initial_balance: { increment: amount } },
      select: { initial_balance: true },
    })

    const transaction = await prismaItems.transactions.create({
      data: {
        buyer_id: user.id,
        item_id: null,
        kind: 'topup',
        amount,
        payment_status: 'completed',
        transaction_date: new Date(),
      },
    })

    let savedReview = null
    if (review && (review.text?.trim() || Number.isFinite(Number(review.rating)))) {
      savedReview = await prismaItems.reviews.create({
        data: {
          user_id: user.id,
          item_id: null,
          review_type: 'platform',
          rating: Number.isFinite(Number(review.rating)) ? Number(review.rating) : null,
          review_text: review.text?.trim() || null,
        },
        select: { review_id: true },
      })
    }

    // Best-effort on-chain record — never blocks the response.
    recordLedger({
      kind: 'topup',
      userId: user.id,
      amount,
      ref: transaction.transaction_id,
    }).catch((err) => console.error('[API] topup ledger record failed:', err.message))

    return NextResponse.json(
      {
        success: true,
        newBalance: Number(updated.initial_balance ?? 0),
        transactionId: transaction.transaction_id,
        reviewId: savedReview?.review_id ?? null,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Top-up error:', error)
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL' }, { status: 500 })
  }
}
