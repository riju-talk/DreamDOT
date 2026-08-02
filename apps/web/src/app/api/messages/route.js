import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Conversation, Message, User } from '@repo/database-mongo'

/**
 * POST /api/messages
 * Create a new message in a conversation
 * Body: { conversationId: string, content: string, type?: 'text'|'image'|'file'|'audio'|'video', attachments?: Array }
 */
export async function POST(req) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to POST /api/messages')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()

    // Validate required fields
    const { conversationId, content } = body
    if (!conversationId || typeof conversationId !== 'string') {
      console.log('[API] POST /api/messages - missing or invalid conversationId')
      return NextResponse.json({ error: 'Conversation ID required and must be a string' }, { status: 400 })
    }

    if (!content || typeof content !== 'string') {
      console.log('[API] POST /api/messages - missing or invalid content')
      return NextResponse.json({ error: 'Content required and must be a string' }, { status: 400 })
    }

    // Validate content length
    if (content.trim().length === 0) {
      console.log('[API] POST /api/messages - empty content')
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 })
    }

    if (content.length > 4000) {
      console.log('[API] POST /api/messages - content too long')
      return NextResponse.json({ error: 'Content must be 4000 characters or less' }, { status: 400 })
    }

    console.log(`[API] POST /api/messages - conversationId: ${conversationId}, userId: ${userId}`)

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

    // Validate type if provided
    const messageType = body.type || 'text'
    if (!['text', 'image', 'file', 'audio', 'video', 'system'].includes(messageType)) {
      console.log('[API] POST /api/messages - invalid type:', messageType)
      return NextResponse.json({ error: 'Invalid message type' }, { status: 400 })
    }

    // Validate attachments if provided
    if (body.attachments && !Array.isArray(body.attachments)) {
      console.log('[API] POST /api/messages - attachments must be an array')
      return NextResponse.json({ error: 'Attachments must be an array' }, { status: 400 })
    }

    // Create message
    const message = new Message({
      conversationId,
      senderId: userId,
      content,
      type: messageType,
      attachments: body.attachments || [],
      timestamp: new Date(),
      readBy: [userId]
    })

    await message.save()

    // Update conversation lastMessage and lastMessageAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date()
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
      editedAt: null
    }

    console.log(`[API] POST /api/messages - created message ${message._id}`)

    return NextResponse.json({ message: createdMessage }, { status: 201 })
  } catch (error) {
    console.error('[API] Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
