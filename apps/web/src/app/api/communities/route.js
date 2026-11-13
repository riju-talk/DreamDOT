import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

export async function GET() {
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

    // Fetch communities where user is a member
    const memberships = await prismaCommunity.members.findMany({
      where: { user_id: currentUser.id },
      include: {
        servers: {
          include: {
            channels: {
              orderBy: { position: 'asc' },
            },
            _count: {
              select: { members: true },
            },
          },
        },
      },
    })

    const communities = memberships.map((membership) => ({
      id: membership.servers.server_id,
      name: membership.servers.name,
      description: membership.servers.description,
      ownerId: membership.servers.owner_id,
      isPublic: membership.servers.is_public,
      role: membership.role,
      memberCount: membership.servers._count.members,
      channels: membership.servers.channels.map((ch) => ({
        id: ch.channel_id,
        name: ch.name,
        type: ch.type,
        topic: ch.topic,
        position: ch.position,
      })),
    }))

    return NextResponse.json({ communities }, { status: 200 })
  } catch (error) {
    console.error('Error fetching communities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
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

    const { name, description, isPublic } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Community name is required' }, { status: 400 })
    }

    // Create community (server)
    const community = await prismaCommunity.servers.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        owner_id: currentUser.id,
        is_public: isPublic ?? true,
        channels: {
          create: [
            {
              name: 'general',
              type: 'text',
              position: 0,
            },
          ],
        },
        members: {
          create: [
            {
              user_id: currentUser.id,
              role: 'owner',
            },
          ],
        },
      },
      include: {
        channels: {
          orderBy: { position: 'asc' },
        },
      },
    })

    return NextResponse.json(
      {
        community: {
          id: community.server_id,
          name: community.name,
          description: community.description,
          ownerId: community.owner_id,
          isPublic: community.is_public,
          role: 'owner',
          memberCount: 1,
          channels: community.channels.map((ch) => ({
            id: ch.channel_id,
            name: ch.name,
            type: ch.type,
            topic: ch.topic,
            position: ch.position,
          })),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating community:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
