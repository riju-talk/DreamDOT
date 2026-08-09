import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

/**
 * GET /api/communities/[communityId]/presence
 * Snapshot of member online/offline status, persisted by apps/chat on socket
 * connect/disconnect. Needed because a member who was already online before you
 * loaded the page won't produce a live socket event for you to catch.
 */
export async function GET(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { communityId } = await params

    const membership = await prismaCommunity.members.findUnique({
      where: { server_id_user_id: { server_id: communityId, user_id: currentUser.id } },
    })
    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this community' }, { status: 403 })
    }

    const members = await prismaCommunity.members.findMany({ where: { server_id: communityId } })
    const userIds = members.map((m) => m.user_id)

    const rows = await prismaCommunity.presence.findMany({ where: { user_id: { in: userIds } } })

    const presence = {}
    for (const row of rows) {
      presence[row.user_id] = { status: row.status, lastSeen: row.last_seen }
    }

    return NextResponse.json({ presence })
  } catch (error) {
    console.error('Error fetching community presence:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
