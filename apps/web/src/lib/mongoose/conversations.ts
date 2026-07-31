import { connectToDatabase } from './connection'
import { Conversation, Message, User } from '@repo/database-mongo'

async function enrichParticipants(userIds: string[]) {
  if (!userIds.length) return []
  await connectToDatabase()
  const users = await User.find({ _id: { $in: userIds } }).lean() as any[]
  const userMap = new Map(users.map(u => [u._id.toString(), u]))

  return userIds.map((id, idx) => {
    const user = userMap.get(id)
    return {
      id,
      name: user?.name || 'Unknown',
      avatar: user?.avatar || '',
    }
  })
}

async function enrichSenderInfo(messages: any[]) {
  const senderIds = [...new Set(messages.map(m => m.senderId))]
  if (!senderIds.length) return messages

  await connectToDatabase()
  const users = await User.find({ _id: { $in: senderIds } }).lean() as any[]
  const userMap = new Map(users.map(u => [u._id.toString(), u]))

  return messages.map(msg => ({
    ...msg,
    senderName: userMap.get(msg.senderId)?.name || 'Unknown',
    senderAvatar: userMap.get(msg.senderId)?.avatar || '',
  }))
}

export async function fetchConversations(userId: string): Promise<{
  conversations: any[]
}> {
  try {
    await connectToDatabase()

    const conversations = await Conversation.find({
      participants: userId
    }).lean()

    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv: any) => {
        const lastMessage = await Message.findOne({
          conversationId: conv._id
        }).sort({ timestamp: -1 }).lean() as any

        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          readBy: { $ne: userId }
        })

        const participants = await enrichParticipants(conv.participants || [])

        let lastMsgData = null
        if (lastMessage) {
          const enriched = await enrichSenderInfo([lastMessage])
          lastMsgData = {
            id: enriched[0]._id.toString(),
            content: enriched[0].content,
            senderId: enriched[0].senderId,
            senderName: enriched[0].senderName,
            senderAvatar: enriched[0].senderAvatar,
            timestamp: enriched[0].timestamp?.toISOString?.() || enriched[0].timestamp,
            type: enriched[0].type,
            attachments: enriched[0].attachments || [],
            isRead: enriched[0].readBy ? enriched[0].readBy.includes(userId) : false
          }
        }

        return {
          id: conv._id.toString(),
          type: conv.type === 'direct' ? 'dm' : conv.type,
          name: conv.name || (conv.type === 'direct' ? 'Direct Message' : 'Group Chat'),
          avatar: conv.avatar || '',
          participants,
          lastMessage: lastMsgData,
          unreadCount,
          lastSeen: conv.lastMessageAt?.toISOString?.() || null,
          createdAt: conv.createdAt?.toISOString?.() || new Date().toISOString(),
          updatedAt: conv.updatedAt?.toISOString?.() || (conv.createdAt?.toISOString?.() || new Date().toISOString())
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

    const enriched = await enrichSenderInfo(messages)

    const formattedMessages = enriched.map(msg => ({
      id: msg._id.toString(),
      content: msg.content,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderAvatar: msg.senderAvatar,
      timestamp: msg.timestamp?.toISOString?.() || msg.timestamp,
      type: msg.type,
      attachments: msg.attachments || [],
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
  type: 'dm' | 'group'
  name?: string
  participantIds: string[]
  isPrivate?: boolean
}): Promise<{ conversation: any }> {
  try {
    await connectToDatabase()

    const dbType = type === 'dm' ? 'direct' : type

    const conversation = new Conversation({
      type: dbType,
      name: name || `Chat ${new Date().toLocaleDateString()}`,
      isArchived: isPrivate,
      participants: participantIds,
      admins: [participantIds[0]],
      createdBy: participantIds[0],
      lastMessageAt: new Date(),
    })

    await conversation.save()
    const participants = await enrichParticipants(conversation.participants || [])

    return {
      conversation: {
        id: conversation._id.toString(),
        type: type,
        name: conversation.name,
        avatar: conversation.avatar || '',
        participants,
        unreadCount: 0,
        createdAt: conversation.createdAt?.toISOString?.() || new Date().toISOString(),
        updatedAt: conversation.updatedAt?.toISOString?.() || new Date().toISOString()
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
}: {
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type?: 'text' | 'image' | 'file' | 'audio' | 'video'
  attachments?: Array<{ url: string; type: string; name?: string; size?: number }>
}): Promise<{ message: any }> {
  try {
    await connectToDatabase()

    const message = new Message({
      conversationId,
      senderId,
      content,
      type,
      attachments,
      timestamp: new Date(),
      readBy: [senderId]
    })

    await message.save()

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date()
    })

    return {
      message: {
        id: message._id.toString(),
        content: message.content,
        senderId: message.senderId,
        senderName,
        senderAvatar: senderAvatar || '',
        timestamp: message.timestamp?.toISOString?.() || message.timestamp,
        type: message.type,
        attachments: message.attachments || [],
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
