import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Conversation, Message, User } from '@repo/database-mongo'

/**
 * Validates pagination parameters
 */
function validatePagination(limit, offset) {
  const parsedLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100)
  const parsedOffset = Math.max(parseInt(offset) || 0, 0)
  return { limit: parsedLimit, offset: parsedOffset }
}

/**
 * GET /api/conversations/[id]/messages
 * Fetch messages for a conversation with pagination
 * Query params: limit=20, offset=0
 */
export async function GET(req, { params }) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to GET /api/conversations/[id]/messages')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.id
    const userId = session.user.id

    // Validate conversationId
    if (!conversationId) {
      console.log('[API] GET /api/conversations/[id]/messages - missing conversationId')
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    console.log(`[API] GET /api/conversations/[id]/messages - conversationId: ${conversationId}, userId: ${userId}`)

    // Extract and validate pagination params
    const url = new URL(req.url)
    const limit = url.searchParams.get('limit')
    const offset = url.searchParams.get('offset')
    const { limit: validatedLimit, offset: validatedOffset } = validatePagination(limit, offset)

    // Connect to database
    await connectToDatabase()

    // Verify user is participant
    const conversation = await Conversation.findById(conversationId).lean()
    if (!conversation) {
      console.log(`[API] Conversation not found: ${conversationId}`)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.participants.includes(userId)) {
      console.log(`[API] User ${userId} not participant in conversation ${conversationId}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch messages with pagination
    const messages = await Message.find({
      conversationId
    })
      .sort({ timestamp: -1 })
      .skip(validatedOffset)
      .limit(validatedLimit)
      .lean()

    // Get total count
    const total = await Message.countDocuments({
      conversationId
    })

    // Enrich messages with sender info
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        const sender = await User.findById(msg.senderId).lean()
        return {
          id: msg._id.toString(),
          conversationId: msg.conversationId,
          content: msg.content,
          senderId: msg.senderId,
          senderName: sender?.name || 'Unknown',
          senderAvatar: sender?.avatar || '',
          timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
          type: msg.type || 'text',
          attachments: msg.attachments || [],
          readBy: msg.readBy || [],
          isRead: (msg.readBy || []).includes(userId),
          editedAt: msg.editedAt?.toISOString() || null
        }
      })
    )

    // Reverse to get chronological order (since we sorted descending)
    enrichedMessages.reverse()

    console.log(`[API] GET /api/conversations/[id]/messages - returned ${enrichedMessages.length} messages`)

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
    console.error('[API] Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/conversations/[id]/messages
 * Send a message to a conversation
 * Body: { content: string, type?: 'text'|'image'|'file', attachments?: any[] }
 */
export async function POST(req, { params }) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to POST /api/conversations/[id]/messages')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.id
    const userId = session.user.id
    const body = await req.json()

    // Validate conversationId
    if (!conversationId) {
      console.log('[API] POST /api/conversations/[id]/messages - missing conversationId')
      return NextResponse.json({ error: 'Conversation ID required' }, { status: 400 })
    }

    // Validate message content
    const { content, type = 'text', attachments } = body
    if (!content || typeof content !== 'string') {
      console.log('[API] POST /api/conversations/[id]/messages - missing or invalid content')
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    // Enforce character limit
    if (content.length > 4000) {
      console.log('[API] POST /api/conversations/[id]/messages - content too long')
      return NextResponse.json({ error: 'Message exceeds maximum length (4000 characters)' }, { status: 400 })
    }

    console.log(
      `[API] POST /api/conversations/[id]/messages - conversationId: ${conversationId}, userId: ${userId}, type: ${type}`
    )

    // Connect to database
    await connectToDatabase()

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId).lean()
    if (!conversation) {
      console.log(`[API] Conversation not found: ${conversationId}`)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.participants.includes(userId)) {
      console.log(`[API] User ${userId} not participant in conversation ${conversationId}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId: userId,
      content,
      type,
      attachments: attachments || [],
      timestamp: new Date(),
      readBy: [userId],
    })

    await message.save()

    // Update conversation lastMessage and lastMessageAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    })

    // Get sender info
    const sender = await User.findById(userId).lean()

    const createdMessage = {
      id: message._id.toString(),
      conversationId: message.conversationId,
      content: message.content,
      senderId: message.senderId,
      senderName: sender?.name || 'Unknown',
      senderAvatar: sender?.avatar || '',
      timestamp: message.timestamp?.toISOString() || new Date().toISOString(),
      type: message.type,
      attachments: message.attachments || [],
      readBy: message.readBy || [],
      isRead: true,
      editedAt: null,
    }

    console.log(`[API] POST /api/conversations/[id]/messages - created message ${message._id}`)

    return NextResponse.json({ message: createdMessage }, { status: 201 })
  } catch (error) {
    console.error('[API] Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
