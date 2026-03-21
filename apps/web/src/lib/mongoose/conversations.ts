import { connectToDatabase } from './connection'
import { Conversation, Message } from '@repo/database-mongo'

export async function fetchConversations(userId: string): Promise<{
  conversations: any[]
}> {
  try {
    await connectToDatabase()

    // Use .find() directly on the model
    const conversations = await Conversation.find({
      'participants': userId
    }).lean()

    // Get last message for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv: any) => {
        const lastMessage = await Message.findOne({
          conversationId: conv._id
        }).sort({ timestamp: -1 }).lean() as any

        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          readBy: { $ne: userId }
        })

        return {
          id: conv._id.toString(),
          type: conv.type,
          name: conv.name || (conv.type === 'direct' ? 'Direct Message' : 'Group Chat'),
          avatar: conv.avatar,
          participants: conv.participants,
          lastMessage: lastMessage ? {
            id: lastMessage._id.toString(),
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            senderName: lastMessage.senderName, // Note: Shared model might need updating if these fields are missing
            timestamp: lastMessage.timestamp.toISOString(),
            type: lastMessage.type,
            isRead: lastMessage.readBy ? lastMessage.readBy.includes(userId) : false
          } : null,
          unreadCount,
          createdAt: conv.createdAt ? conv.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: conv.updatedAt ? conv.updatedAt.toISOString() : (conv.createdAt ? conv.createdAt.toISOString() : new Date().toISOString())
        }
      })
    )

    return {
      conversations: conversationsWithMessages.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    }
  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error
  }
}

export async function fetchMessages(conversationId: string, userId: string): Promise<{
  messages: any[]
}> {
  try {
    await connectToDatabase()

    const messages = await Message.find({
      conversationId
    }).sort({ timestamp: 1 }).lean() as any[]

    const formattedMessages = messages.map(msg => ({
      id: msg._id.toString(),
      content: msg.content,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderAvatar: msg.senderAvatar,
      timestamp: msg.timestamp.toISOString(),
      type: msg.type,
      attachments: msg.attachments || [],
      fileName: msg.fileName,
      isRead: msg.readBy ? msg.readBy.includes(userId) : false
    }))

    return { messages: formattedMessages }
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

export async function createConversation({
  type,
  name,
  participantIds,
  isPrivate = false
}: {
  type: 'direct' | 'group'
  name?: string
  participantIds: string[]
  isPrivate?: boolean
}): Promise<{ conversation: any }> {
  try {
    await connectToDatabase()

    // Note: Shared model ConversationSchema defines participants as [String] (IDs), not objects with roles
    // Adjusting to shared schema
    const conversation = new Conversation({
      type,
      name,
      isArchived: isPrivate, // Mapping isPrivate to isArchived or adding field if needed
      participants: participantIds,
      admins: [participantIds[0]], // Assuming creator is first
      createdBy: participantIds[0],
      createdAt: new Date()
    })

    await conversation.save()

    return {
      conversation: {
        id: conversation._id.toString(),
        type: conversation.type,
        name: conversation.name,
        isPrivate: conversation.isArchived,
        participants: conversation.participants,
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
        unreadCount: 0
      }
    }
  } catch (error) {
    console.error('Error creating conversation:', error)
    throw error
  }
}

export async function sendMessage({
  conversationId,
  senderId,
  senderName,
  senderAvatar,
  content,
  type = 'text',
  attachments = [],
  fileName
}: {
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type?: 'text' | 'image' | 'file' | 'audio' | 'video'
  attachments?: Array<{ url: string; type: string; name?: string; size?: number }>
  fileName?: string
}): Promise<{ message: any }> {
  try {
    await connectToDatabase()

    const message = new Message({
      conversationId,
      conversation: conversationId, // Shared model requires conversation ref
      senderId,
      sender: senderId, // Shared model uses 'sender' for ID too usually, or name? Check model.
      // Shared model Message.ts: sender: { type: String, required: true } -> This is likely ID or Name. 
      // apps/chat used userId. Let's assume ID.
      // But keeping senderName/Avatar in content or metadata might be needed if not in schema.
      // Schema has senderId (String) and sender (String).
      content,
      type,
      attachments,
      // fileName not in shared schema options? Attachment schema exists.
      // Map fileName to attachment if needed or assume text content contains it.
      timestamp: new Date(),
      readBy: [senderId]
    })

    await message.save()

    // Update conversation's updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date()
    })

    return {
      message: {
        id: message._id.toString(),
        content: message.content,
        senderId: message.senderId,
        senderName: senderName, // Return passed name for UI
        senderAvatar: senderAvatar,
        timestamp: message.timestamp.toISOString(),
        type: message.type,
        attachments: message.attachments || [],
        fileName: fileName,
        isRead: true
      }
    }
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

export async function markConversationAsRead(conversationId: string, userId: string): Promise<void> {
  try {
    await connectToDatabase()

    // Mark all messages in the conversation as read by this user
    await Message.updateMany(
      {
        conversationId,
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId }
      }
    )
  } catch (error) {
    console.error('Error marking conversation as read:', error)
    throw error
  }
}
