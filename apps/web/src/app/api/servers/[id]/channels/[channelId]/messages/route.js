import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Message, User, Channel } from '@repo/database-mongo'

/**
 * Validates pagination parameters
 */
function validatePagination(limit, offset) {
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100)
  const parsedOffset = Math.max(parseInt(offset) || 0, 0)
  return { limit: parsedLimit, offset: parsedOffset }
}

/**
 * GET /api/servers/[id]/channels/[channelId]/messages
 * Fetch messages for a TEXT-ONLY channel with pagination
 * CRITICAL: Validates channel is text-only, rejects voice/stage channels
 * Query params: limit=20, offset=0
 */
export async function GET(req, { params }) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to GET /api/servers/[id]/channels/[channelId]/messages')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: serverId, channelId } = params
    const userId = session.user.id

    // Validate parameters
    if (!serverId || !channelId) {
      console.log('[API] GET /api/servers/[id]/channels/[channelId]/messages - missing parameters')
      return NextResponse.json({ error: 'Server ID and Channel ID required' }, { status: 400 })
    }

    console.log(
      `[API] GET /api/servers/[id]/channels/[channelId]/messages - serverId: ${serverId}, channelId: ${channelId}, userId: ${userId}`
    )

    // Extract and validate pagination params
    const url = new URL(req.url)
    const limit = url.searchParams.get('limit')
    const offset = url.searchParams.get('offset')
    const { limit: validatedLimit, offset: validatedOffset } = validatePagination(limit, offset)

    // Connect to database
    await connectToDatabase()

    // Verify channel exists and is TEXT type
    const channel = await Channel.findById(channelId).lean()
    if (!channel) {
      console.log(`[API] Channel not found: ${channelId}`)
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // CRITICAL: Enforce text-only validation
    if (channel.type !== 'text') {
      console.log(`[API] Access denied to non-text channel: ${channelId}, type: ${channel.type}`)
      return NextResponse.json(
        { error: `Cannot access ${channel.type} channels through text messaging API` },
        { status: 403 }
      )
    }

    // Verify user has access to server
    // TODO: Implement proper server membership check

    // Fetch messages with pagination
    const messages = await Message.find({
      channelId,
      type: 'text', // Only text messages in text channels
    })
      .sort({ timestamp: -1 })
      .skip(validatedOffset)
      .limit(validatedLimit)
      .lean()

    // Get total count
    const total = await Message.countDocuments({
      channelId,
      type: 'text',
    })

    // Enrich messages with sender info
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

    // Reverse to get chronological order
    enrichedMessages.reverse()

    console.log(
      `[API] GET /api/servers/[id]/channels/[channelId]/messages - returned ${enrichedMessages.length} messages`
    )

    return NextResponse.json({
      messages: enrichedMessages,
      pagination: {
        limit: validatedLimit,
        offset: validatedOffset,
        total,
        hasMore: validatedOffset + validatedLimit < total,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching channel messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/servers/[id]/channels/[channelId]/messages
 * Send a message to a TEXT-ONLY channel
 * CRITICAL: Validates channel is text-only before accepting message
 * Body: { content: string, attachments?: any[] }
 */
export async function POST(req, { params }) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to POST /api/servers/[id]/channels/[channelId]/messages')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: serverId, channelId } = params
    const userId = session.user.id
    const body = await req.json()

    // Validate parameters
    if (!serverId || !channelId) {
      console.log('[API] POST /api/servers/[id]/channels/[channelId]/messages - missing parameters')
      return NextResponse.json({ error: 'Server ID and Channel ID required' }, { status: 400 })
    }

    // Validate message content
    const { content, attachments } = body
    if (!content || typeof content !== 'string') {
      console.log('[API] POST /api/servers/[id]/channels/[channelId]/messages - missing or invalid content')
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    // Enforce character limit
    if (content.length > 4000) {
      console.log('[API] POST /api/servers/[id]/channels/[channelId]/messages - content too long')
      return NextResponse.json({ error: 'Message exceeds maximum length (4000 characters)' }, { status: 400 })
    }

    console.log(
      `[API] POST /api/servers/[id]/channels/[channelId]/messages - serverId: ${serverId}, channelId: ${channelId}, userId: ${userId}`
    )

    // Connect to database
    await connectToDatabase()

    // Verify channel exists and is TEXT type
    const channel = await Channel.findById(channelId).lean()
    if (!channel) {
      console.log(`[API] Channel not found: ${channelId}`)
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // CRITICAL: Enforce text-only validation at API level
    if (channel.type !== 'text') {
      console.log(`[API] Cannot post to non-text channel: ${channelId}, type: ${channel.type}`)
      return NextResponse.json(
        { error: `Cannot post to ${channel.type} channels - text messages only` },
        { status: 403 }
      )
    }

    // Verify user has access to server
    // TODO: Implement proper server membership check

    // Create message (text type only)
    const message = new Message({
      channelId,
      content,
      senderId: userId,
      type: 'text',
      attachments: attachments || [],
      timestamp: new Date(),
    })

    await message.save()

    // Get sender info
    const sender = await User.findById(userId).lean()

    const responseMessage = {
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
    }

    console.log(
      `[API] POST /api/servers/[id]/channels/[channelId]/messages - created message ${message._id}`
    )

    return NextResponse.json({ message: responseMessage }, { status: 201 })
  } catch (error) {
    console.error('[API] Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
