import { NextResponse } from 'next/server'
import { getBalance } from '@/lib/services/credits'
import { errorResponse, getSessionUserId, unauthorized } from '@/lib/services/http'

/** GET /api/balance — demo credit balance + spend/earn stats (shared with GraphQL `balance`). */
export async function GET() {
  try {
    const userId = await getSessionUserId()
    if (!userId) return unauthorized()

    const { credits, totalSpent, totalEarned } = await getBalance(userId)
    return NextResponse.json({ balance: { credits }, stats: { totalSpent, totalEarned }, user: { id: userId } })
  } catch (err) {
    return errorResponse(err, 'get balance')
  }
}
