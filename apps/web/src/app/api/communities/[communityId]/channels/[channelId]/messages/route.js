import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Message, User } from '@repo/database-mongo'

/**
 * Channel structure/membership lives in Postgres (prismaCommunity); message CONTENT
 * lives in MongoDB (Message, keyed by channelId instead of conversationId) — same
 * split used for DMs. The previous version of this route imported a `Channel` model
 * from @repo/database-mongo that was never exported there and crashed at runtime;
 * this version validates the channel/membership against Postgres instead.
 */

function validatePagination(limit, offset) {
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100)
  const parsedOffset = Math.max(parseInt(offset) || 0, 0)
  return { limit: parsedLimit, offset: parsedOffset }
}

async function resolveCurrentUserId(session) {
  if (session?.user?.id) return session.user.id
  if (!session?.user?.email) return null
  const user = await prismaUser.users.findUnique({ where: { email: session.user.email }, select: { id: true } })
  return user?.id || null
}

async function loadAndAuthorizeChannel(communityId, channelId, userId) {
  const channel = await prismaCommunity.channels.findUnique({ where: { channel_id: channelId } })
  if (!channel || channel.server_id !== communityId) {
    return { error: NextResponse.json({ error: 'Channel not found' }, { status: 404 }) }
  }
  if (channel.type !== 'text') {
    return {
      error: NextResponse.json(
        { error: `Cannot access ${channel.type} channels through text messaging` },
        { status: 403 }
      ),
    }
  }
  const membership = await prismaCommunity.members.findUnique({
    where: { server_id_user_id: { server_id: communityId, user_id: userId } },
  })
  if (!membership) {
    return { error: NextResponse.json({ error: 'Not a member of this community' }, { status: 403 }) }
  }
  return { channel, membership }
}

/**
 * GET /api/communities/[communityId]/channels/[channelId]/messages
 * Query params: limit=20, offset=0
 */
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = await resolveCurrentUserId(session)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { communityId, channelId } = await params
    const url = new URL(req.url)
    const { limit, offset } = validatePagination(url.searchParams.get('limit'), url.searchParams.get('offset'))

    const { error } = await loadAndAuthorizeChannel(communityId, channelId, userId)
    if (error) return error

    await connectToDatabase()

    const [messages, total] = await Promise.all([
      Message.find({ channelId }).sort({ timestamp: -1 }).skip(offset).limit(limit).lean(),
      Message.countDocuments({ channelId }),
    ])

    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await User.findById(msg.senderId).lean()
        return {
          id: msg._id.toString(),
          channelId: msg.channelId,
          content: msg.content,
          senderId: msg.senderId,
          senderName: sender?.name || 'Unknown',
          senderAvatar: sender?.avatar || '',
          timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
          type: msg.type || 'text',
          attachments: msg.attachments || [],
          editedAt: msg.editedAt?.toISOString() || null,
        }
      })
    )

    enrichedMessages.reverse()

    return NextResponse.json({
      messages: enrichedMessages,
      pagination: { limit, offset, total, hasMore: offset + limit < total },
    })
  } catch (error) {
    console.error('[API] Error fetching channel messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/communities/[communityId]/channels/[channelId]/messages
 * Body: { content: string, attachments?: any[] }
 *
 * REST fallback — the primary send path is Socket.IO (apps/chat `channel:message:send`)
 * for live delivery; this exists for non-realtime/initial-history-independent sends
 * and matches the equivalent DM REST fallback in apps/chat/server.js.
 */
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = await resolveCurrentUserId(session)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { communityId, channelId } = await params
    const body = await req.json()
    const { content, attachments } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }
    if (content.length > 4000) {
      return NextResponse.json({ error: 'Message exceeds maximum length (4000 characters)' }, { status: 400 })
    }

    const { error } = await loadAndAuthorizeChannel(communityId, channelId, userId)
    if (error) return error

    await connectToDatabase()

    const message = await Message.create({
      channelId,
      senderId: userId,
      content,
      type: 'text',
      attachments: Array.isArray(attachments) ? attachments : [],
      readBy: [userId],
      timestamp: new Date(),
    })

    const sender = await User.findById(userId).lean()

    return NextResponse.json(
      {
        message: {
          id: message._id.toString(),
          channelId: message.channelId,
          content: message.content,
          senderId: message.senderId,
          senderName: sender?.name || 'Unknown',
          senderAvatar: sender?.avatar || '',
          timestamp: message.timestamp?.toISOString() || new Date().toISOString(),
          type: 'text',
          attachments: message.attachments || [],
          editedAt: null,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Error sending channel message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
