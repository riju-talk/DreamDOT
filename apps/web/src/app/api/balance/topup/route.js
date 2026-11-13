import { NextResponse } from 'next/server'
import { topUp } from '@/lib/services/credits'
import { errorResponse, getSessionUserId, unauthorized } from '@/lib/services/http'

/**
 * POST /api/balance/topup   Body: { amount, review?: { rating?, text? } }
 * Free demo top-up; rules live in lib/services/credits.js (shared with GraphQL `topUp`).
 */
export async function POST(request) {
  try {
    const userId = await getSessionUserId()
    if (!userId) return unauthorized()

    const body = await request.json().catch(() => ({}))
    const result = await topUp({ userId, amount: Number(body?.amount), review: body?.review })

    return NextResponse.json({ success: true, ...result }, { status: 201 })
  } catch (err) {
    return errorResponse(err, 'top-up')
  }
}
