import { prismaUser } from '@/lib/prisma/user'
import { prismaItems } from '@/lib/prisma/items'
import { recordLedger } from '@/lib/web3'
import { ServiceError } from './errors'

export const MAX_TOPUP = 100000

/** Balance lives in Postgres `users.initial_balance`; spent/earned come from completed transactions. */
export async function getBalance(userId) {
  const user = await prismaUser.users.findUnique({ where: { id: userId }, select: { id: true, initial_balance: true } })
  if (!user) throw new ServiceError('USER_NOT_FOUND', 'User not found', 404)

  const [spent, earned] = await Promise.all([
    prismaItems.transactions.aggregate({
      where: { buyer_id: userId, payment_status: 'completed' },
      _sum: { amount: true },
    }),
    prismaItems.transactions.aggregate({
      where: { payment_status: 'completed', items: { is: { user_id: userId } } },
      _sum: { amount: true },
    }),
  ])

  return {
    credits: Number(user.initial_balance ?? 0),
    totalSpent: Number(spent._sum.amount ?? 0),
    totalEarned: Number(earned._sum.amount ?? 0),
  }
}

/**
 * Free demo top-up (no payment). The increment compiles to a single atomic SQL
 * `SET balance = balance + n`, so concurrent top-ups cannot lose updates (no
 * read-modify-write race). The on-chain ledger record is best-effort: Postgres is the
 * source of truth, the chain is an audit trail that may lag (eventually consistent).
 */
export async function topUp({ userId, amount, review }) {
  if (!Number.isFinite(amount) || amount <= 0) throw new ServiceError('INVALID_AMOUNT', 'amount must be a positive number', 400)
  if (amount > MAX_TOPUP) throw new ServiceError('AMOUNT_TOO_LARGE', `amount cannot exceed ${MAX_TOPUP}`, 400)

  const exists = await prismaItems.users.findUnique({ where: { id: userId }, select: { id: true } })
  if (!exists) throw new ServiceError('USER_NOT_FOUND', 'User not found', 404)

  const updated = await prismaItems.users.update({
    where: { id: userId },
    data: { initial_balance: { increment: amount } },
    select: { initial_balance: true },
  })

  const transaction = await prismaItems.transactions.create({
    data: { buyer_id: userId, item_id: null, kind: 'topup', amount, payment_status: 'completed', transaction_date: new Date() },
  })

  let savedReview = null
  const rating = Number(review?.rating)
  if (review && (review.text?.trim() || Number.isFinite(rating))) {
    savedReview = await prismaItems.reviews.create({
      data: {
        user_id: userId,
        item_id: null,
        review_type: 'platform',
        rating: Number.isFinite(rating) ? rating : null,
        review_text: review.text?.trim() || null,
      },
      select: { review_id: true },
    })
  }

  recordLedger({ kind: 'topup', userId, amount, ref: transaction.transaction_id }).catch((err) =>
    console.error('[credits] ledger record failed (non-fatal):', err.message)
  )

  return {
    newBalance: Number(updated.initial_balance ?? 0),
    transactionId: transaction.transaction_id,
    reviewId: savedReview?.review_id ?? null,
  }
}
