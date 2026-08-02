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
 * GET /api/conversations
 * Fetch user's conversations with pagination
 * Query params: limit=20, offset=0
 */
export async function GET(req) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to GET /api/conversations')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    console.log(`[API] GET /api/conversations - userId: ${userId}`)

    // Extract and validate pagination params
    const url = new URL(req.url)
    const limit = url.searchParams.get('limit')
    const offset = url.searchParams.get('offset')
    const { limit: validatedLimit, offset: validatedOffset } = validatePagination(limit, offset)

    // Connect to database
    await connectToDatabase()

    // Fetch conversations for user with pagination
    const conversations = await Conversation.find({
      participants: userId
    })
      .sort({ lastMessageAt: -1 })
      .skip(validatedOffset)
      .limit(validatedLimit)
      .lean()

    // Get total count
    const total = await Conversation.countDocuments({
      participants: userId
    })

    // Enrich conversations with message and participant data
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Get unread count
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          readBy: { $ne: userId }
        })

        // Get last message
        let lastMessage = null
        const lastMsg = await Message.findOne({
          conversationId: conv._id
        })
          .sort({ timestamp: -1 })
          .lean()

        if (lastMsg) {
          const sender = await User.findById(lastMsg.senderId).lean()
          lastMessage = {
            id: lastMsg._id.toString(),
            content: lastMsg.content,
            senderId: lastMsg.senderId,
            senderName: sender?.name || 'Unknown',
            senderAvatar: sender?.avatar || '',
            timestamp: lastMsg.timestamp?.toISOString() || new Date().toISOString(),
            type: lastMsg.type
          }
        }

        // Get participants info
        const participantIds = conv.participants || []
        const participants = await User.find({ _id: { $in: participantIds } }).lean()
        const participantsInfo = participantIds.map((id) => {
          const user = participants.find((u) => u._id.toString() === id)
          return {
            id,
            name: user?.name || 'Unknown',
            avatar: user?.avatar || ''
          }
        })

        return {
          id: conv._id.toString(),
          type: conv.type || 'direct',
          name: conv.name || 'Conversation',
          avatar: conv.avatar || '',
          participants: participantsInfo,
          lastMessage,
          unreadCount,
          createdAt: conv.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: conv.updatedAt?.toISOString() || new Date().toISOString()
        }
      })
    )

    console.log(`[API] GET /api/conversations - returned ${enrichedConversations.length} conversations`)

    return NextResponse.json({
      conversations: enrichedConversations,
      pagination: {
        limit: validatedLimit,
        offset: validatedOffset,
        total
      }
    })
  } catch (error) {
    console.error('[API] Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/conversations
 * Create a new conversation
 * Body: { type: 'direct'|'group', name?: string, participants: string[] }
 */
export async function POST(req) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to POST /api/conversations')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()

    // Validate required fields
    const { type, participants } = body
    if (!type || !Array.isArray(participants)) {
      console.log('[API] POST /api/conversations - missing required fields')
      return NextResponse.json({ error: 'Missing required fields: type, participants' }, { status: 400 })
    }

    // Validate type
    if (!['direct', 'group'].includes(type)) {
      console.log('[API] POST /api/conversations - invalid type:', type)
      return NextResponse.json({ error: 'Invalid type. Must be direct or group' }, { status: 400 })
    }

    // Validate participants
    if (participants.length === 0) {
      console.log('[API] POST /api/conversations - no participants')
      return NextResponse.json({ error: 'At least one participant required' }, { status: 400 })
    }

    console.log(`[API] POST /api/conversations - type: ${type}, userId: ${userId}`)

    // Connect to database
    await connectToDatabase()

    // Create participant list with current user
    const allParticipants = [userId, ...participants.filter((p) => p !== userId)]

    // Create conversation
    const conversation = new Conversation({
      type,
      name: body.name || `Conversation ${new Date().toLocaleDateString()}`,
      participants: allParticipants,
      admins: [userId],
      createdBy: userId,
      avatar: body.avatar || '',
      lastMessageAt: new Date()
    })

    await conversation.save()

    // Enrich with participant data
    const participantsInfo = await Promise.all(
      allParticipants.map(async (id) => {
        const user = await User.findById(id).lean()
        return {
          id,
          name: user?.name || 'Unknown',
          avatar: user?.avatar || ''
        }
      })
    )

    const createdConversation = {
      id: conversation._id.toString(),
      type: conversation.type,
      name: conversation.name,
      avatar: conversation.avatar,
      participants: participantsInfo,
      lastMessage: null,
      unreadCount: 0,
      createdAt: conversation.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: conversation.updatedAt?.toISOString() || new Date().toISOString()
    }

    console.log(`[API] POST /api/conversations - created conversation ${conversation._id}`)

    return NextResponse.json({ conversation: createdConversation }, { status: 201 })
  } catch (error) {
    console.error('[API] Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
