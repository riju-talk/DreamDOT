import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

export async function GET(_request, { params }) {
  try {
    const { communityId } = await params

    const community = await prismaCommunity.servers.findUnique({
      where: { server_id: communityId },
      include: {
        channels: {
          orderBy: { position: 'asc' },
        },
        members: {
          include: {
            // This would need user reference if it exists
          },
        },
        _count: {
          select: { members: true },
        },
      },
    })

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    return NextResponse.json(
      {
        community: {
          id: community.server_id,
          name: community.name,
          description: community.description,
          ownerId: community.owner_id,
          isPublic: community.is_public,
          memberCount: community._count.members,
          channels: community.channels.map((ch) => ({
            id: ch.channel_id,
            name: ch.name,
            type: ch.type,
            topic: ch.topic,
            position: ch.position,
          })),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching community:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/communities/[communityId]
 * Owner-only. Cascades to channels/members via the schema's onDelete: Cascade —
 * channel messages (Mongo, keyed by channelId) are intentionally left orphaned
 * rather than bulk-deleted, matching how deleted conversations/posts are handled
 * elsewhere in this app (soft data retention, not a hard purge).
 */
export async function DELETE(_request, { params }) {
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

    if (community.owner_id !== currentUser.id) {
      return NextResponse.json({ error: 'Only the owner can delete this community' }, { status: 403 })
    }

    await prismaCommunity.servers.delete({ where: { server_id: communityId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting community:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
