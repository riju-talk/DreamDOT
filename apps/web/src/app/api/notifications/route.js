import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'

async function currentUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  const user = await prismaUser.users.findUnique({ where: { email: session.user.email }, select: { id: true } })
  return user?.id ?? null
}

export const dynamic = 'force-dynamic'

// GET /api/notifications -> latest 50 notifications for the signed-in user
export async function GET() {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [items, unread] = await Promise.all([
    prismaSocial.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    }),
    prismaSocial.notifications.count({ where: { user_id: userId, is_read: false } }),
  ])
  return NextResponse.json({ items, unread })
}

// PATCH /api/notifications -> mark all (or { id }) as read
export async function PATCH(request) {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  await prismaSocial.notifications.updateMany({
    where: { user_id: userId, is_read: false, ...(body?.id ? { notification_id: body.id } : {}) },
    data: { is_read: true },
  })
  return NextResponse.json({ success: true })
}
