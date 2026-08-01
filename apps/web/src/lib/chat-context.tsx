
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useSocket } from "./socket"
import type { ChatConversation, ChatMessage, GroupChat, DirectMessage } from "./chat"

interface ChatContextType {
  conversations: ChatConversation[]
  activeConversation: ChatConversation | null
  messages: ChatMessage[]
  isConnected: boolean
  isLoading: boolean
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  sendMessage: (content: string, conversationId: string, attachments?: any[]) => void
  setActiveConversation: (conversation: ChatConversation | null) => void
  createDirectMessage: (userId: string) => Promise<void>
  createGroupChat: (name: string, participants: string[]) => Promise<void>
  searchConversations: (query: string) => ChatConversation[]
  markAsRead: (conversationId: string) => void
  loadConversations: () => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const { socket, isConnected, sendMessage: socketSendMessage, joinRoom, leaveRoom, setTyping } = useSocket()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const sessionUser = (session as any)?.user
  const [isLoading, setIsLoading] = useState(false)

  // Load conversations on mount
  useEffect(() => {
    if (session?.user?.id && (session as any)?.chatToken) {
      loadConversations()
    }
  }, [session?.user?.id, (session as any)?.chatToken])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data: any) => {
      const isOwn = data.senderId === sessionUser?.id
      const newMessage: ChatMessage = {
        id: data._id || data.id,
        content: data.content || '',
        senderId: data.senderId,
        senderName: isOwn ? (sessionUser?.name || 'You') : (data.senderName || 'Unknown'),
        senderAvatar: isOwn ? (sessionUser?.image || '') : (data.senderAvatar || ''),
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type || 'text',
        attachments: data.attachments || [],
        isRead: data.readBy?.includes(sessionUser?.id) || false
      }

      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === newMessage.id)) return prev
        return [...prev, newMessage]
      })

      // Update conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === data.conversationId
            ? { ...conv, lastMessage: newMessage, unreadCount: conv.id === activeConversation?.id ? 0 : conv.unreadCount + 1 }
            : conv
        )
      )
    }

    const handleMessageDelivered = (data: { messageId: string }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === data.messageId
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    }

    const handleTyping = (data: { userId: string; isTyping: boolean; conversationId: string }) => {
      // Handle typing indicators if needed
    }

    const handleUserJoined = (data: { userId: string; timestamp: string }) => {
      // Handle presence updates if needed
    }

    socket.on('message:new', handleNewMessage)
    socket.on('message:delivered', handleMessageDelivered)
    socket.on('message:typing', handleTyping)
    socket.on('presence:join', handleUserJoined)

    return () => {
      socket.off('message:new', handleNewMessage)
      socket.off('message:delivered', handleMessageDelivered)
      socket.off('message:typing', handleTyping)
      socket.off('presence:join', handleUserJoined)
    }
  }, [socket, activeConversation, session, sessionUser])

  const loadConversations = async () => {
    if (!session?.user) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/chat/conversations')

      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`)

      if (response.ok) {
        const data = await response.json()
        const loadedMessages = (data.messages || []).map((msg: any) => ({
          id: msg._id || msg.id,
          content: msg.content || '',
          senderId: msg.senderId,
          senderName: msg.senderName || 'Unknown',
          senderAvatar: msg.senderAvatar || '',
          timestamp: msg.timestamp,
          type: msg.type || 'text',
          attachments: msg.attachments || [],
          isRead: msg.readBy?.includes(sessionUser?.id) || false
        }))

        setMessages(loadedMessages)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const joinConversation = (conversationId: string) => {
    loadMessages(conversationId)
    if (socket && isConnected) {
      joinRoom(conversationId)
    }
  }

  const selectConversation = (conversation: ChatConversation | null) => {
    setActiveConversation(conversation)
    if (conversation) {
      joinConversation(conversation.id)
    }
  }

  const leaveConversation = (conversationId: string) => {
    if (socket && isConnected) {
      leaveRoom(conversationId)
    }
  }

  const sendMessage = (content: string, conversationId: string, attachments?: any[]) => {
    if (!socket || !isConnected || !session?.user) return

    const messageType = attachments && attachments.length > 0 
      ? (attachments[0].type.startsWith('image/') ? 'image' : attachments[0].type.startsWith('video/') ? 'video' : 'file') 
      : 'text'

    const message = {
      conversationId,
      content,
      senderId: (session as any).user.id,
      timestamp: new Date().toISOString(),
      type: messageType,
      attachments: attachments || []
    }

    socketSendMessage(message, (response: any) => {
      if (response.ok) {
        // Message sent successfully
        const newMessage: ChatMessage = {
          id: response.id,
          content,
          senderId: (session as any).user.id,
          senderName: (session as any).user.name || 'You',
          senderAvatar: (session as any).user.image || '',
          timestamp: new Date().toISOString(),
          type: messageType as "text" | "image" | "file" | "audio" | "video",
          attachments: attachments || [],
          isRead: true
        }

        setMessages(prev => [...prev, newMessage])
      } else {
        console.error('Failed to send message:', response.error)
      }
    })
  }

  const createDirectMessage = async (userId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'direct',
          participants: [userId]
        })
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(prev => [data.conversation, ...prev])
        setActiveConversation(data.conversation)
      }
    } catch (error) {
      console.error('Failed to create DM:', error)
    }
  }

  const createGroupChat = async (name: string, participants: string[]) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'group',
          participants,
          name
        })
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(prev => [data.conversation, ...prev])
        setActiveConversation(data.conversation)
      }
    } catch (error) {
      console.error('Failed to create group:', error)
    }
  }

  const searchConversations = (query: string) => {
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(query.toLowerCase()) ||
      conv.participants.some(p => p.name.toLowerCase().includes(query.toLowerCase()))
    )
  }

  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    )
  }

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    isConnected,
    isLoading,
    joinConversation,
    leaveConversation,
    sendMessage,
    setActiveConversation: selectConversation,
    createDirectMessage,
    createGroupChat,
    searchConversations,
    markAsRead,
    loadConversations,
    loadMessages
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
