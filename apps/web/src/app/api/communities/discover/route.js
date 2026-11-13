import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

/**
 * GET /api/communities/discover
 * Browse public communities the current user has NOT already joined.
 * Query params: limit=20, offset=0, q=<search>
 */
export async function GET(request) {
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

    const url = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit')) || 20, 1), 100)
    const offset = Math.max(parseInt(url.searchParams.get('offset')) || 0, 0)
    const q = url.searchParams.get('q')?.trim()

    const where = {
      is_public: true,
      members: { none: { user_id: currentUser.id } },
      ...(q && { name: { contains: q, mode: 'insensitive' } }),
    }

    const [servers, total] = await Promise.all([
      prismaCommunity.servers.findMany({
        where,
        include: { _count: { select: { members: true } } },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
      prismaCommunity.servers.count({ where }),
    ])

    const communities = servers.map((server) => ({
      id: server.server_id,
      name: server.name,
      description: server.description,
      ownerId: server.owner_id,
      memberCount: server._count.members,
      createdAt: server.created_at,
    }))

    return NextResponse.json({
      communities,
      pagination: { limit, offset, total, hasMore: offset + limit < total },
    })
  } catch (error) {
    console.error('Error discovering communities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
