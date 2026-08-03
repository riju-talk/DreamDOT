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

    // Verify user is owner/admin
    const membership = await prismaCommunity.members.findUnique({
      where: {
        server_id_user_id: {
          server_id: communityId,
          user_id: currentUser.id,
        },
      },
    })

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Create channel
    const channel = await prismaCommunity.channels.create({
      data: {
        server_id: communityId,
        name: channelName.trim(),
        topic: description?.trim() || null,
        type: 'text',
        position: 0,
      },
    })

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
