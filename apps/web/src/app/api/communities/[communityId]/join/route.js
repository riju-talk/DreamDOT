import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

/**
 * POST /api/communities/[communityId]/join
 * Self-serve join for a public community. Idempotent — joining twice is a no-op, not an error.
 */
export async function POST(_request, { params }) {
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

    const community = await prismaCommunity.servers.findUnique({ where: { server_id: communityId } })
    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }
    if (!community.is_public) {
      return NextResponse.json({ error: 'This community is private' }, { status: 403 })
    }

    try {
      const member = await prismaCommunity.members.create({
        data: { server_id: communityId, user_id: currentUser.id, role: 'member' },
      })
      return NextResponse.json(
        { member: { id: member.member_id, userId: member.user_id, role: member.role, joinedAt: member.joined_at }, alreadyMember: false },
        { status: 201 }
      )
    } catch (error) {
      if (error.code === 'P2002') {
        const existing = await prismaCommunity.members.findUnique({
          where: { server_id_user_id: { server_id: communityId, user_id: currentUser.id } },
        })
        return NextResponse.json(
          { member: { id: existing.member_id, userId: existing.user_id, role: existing.role, joinedAt: existing.joined_at }, alreadyMember: true },
          { status: 200 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Error joining community:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
