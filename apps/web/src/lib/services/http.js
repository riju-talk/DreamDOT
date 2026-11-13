import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaUser } from '@/lib/prisma/user'
import { ServiceError } from './errors'

/** REST adapter helpers: session -> user id, and ServiceError -> JSON response. */

/** @returns {Promise<string|null>} the signed-in user's id, or null */
export async function getSessionUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  const row = await prismaUser.users.findUnique({ where: { email: session.user.email }, select: { id: true } })
  return row?.id ?? null
}

export const unauthorized = () =>
  NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })

/** Structured `{ error, code }` response; unknown errors are logged and masked as 500. */
export function errorResponse(err, label) {
  if (err instanceof ServiceError) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status })
  }
  console.error(`[API] ${label} failed:`, err)
  return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL' }, { status: 500 })
}
