import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

/**
 * GET /api/communities/[communityId]/channels
 * List a community's channels, ordered by position.
 */
export async function GET(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { communityId } = await params

    const channels = await prismaCommunity.channels.findMany({
      where: { server_id: communityId },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({
      channels: channels.map((ch) => ({
        id: ch.channel_id,
        name: ch.name,
        type: ch.type,
        topic: ch.topic,
        position: ch.position,
      })),
    })
  } catch (error) {
    console.error('Error fetching channels:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/communities/[communityId]/channels
 * Create a text channel. Owner/admin only.
 * Body: { channelName: string, description?: string }
 */
export async function POST(request, { params }) {
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
    const { channelName, description } = await request.json()

    if (!channelName?.trim()) {
      return NextResponse.json({ error: 'Channel name is required' }, { status: 400 })
    }
    if (channelName.trim().length > 100) {
      return NextResponse.json({ error: 'Channel name must be 100 characters or less' }, { status: 400 })
    }

    const membership = await prismaCommunity.members.findUnique({
      where: { server_id_user_id: { server_id: communityId, user_id: currentUser.id } },
    })

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const positionAgg = await prismaCommunity.channels.aggregate({
      where: { server_id: communityId },
      _max: { position: true },
    })
    const position = (positionAgg._max.position ?? -1) + 1

    let channel
    try {
      channel = await prismaCommunity.channels.create({
        data: {
          server_id: communityId,
          name: channelName.trim(),
          topic: description?.trim() || null,
          type: 'text',
          position,
        },
      })
    } catch (error) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'A channel with that name already exists' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json(
      {
        channel: {
          id: channel.channel_id,
          name: channel.name,
          type: channel.type,
          topic: channel.topic,
          position: channel.position,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating channel:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
