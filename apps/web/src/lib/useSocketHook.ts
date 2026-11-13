
"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  initializeSocket,
  getSocket,
  getConnectionState,
  onConnectionStateChange,
  disconnectSocket,
  emitSendMessage,
  emitSubscribeConversation,
  emitTypingIndicator,
  emitMarkRead,
  emitSetOnline,
  emitJoinRoom,
  emitLeaveRoom,
} from './socket'

interface SocketConnectionState {
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
}

/**
 * Hook to initialize and manage Socket.IO connection
 * Automatically handles authentication and cleanup
 * @returns Socket connection state and control functions
 */
export function useSocket() {
  const { data: session } = useSession()
  const [connectionState, setConnectionState] = useState<SocketConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  const token = (session as any)?.chatToken

  useEffect(() => {
    if (!token) {
      disconnectSocket()
      setConnectionState({
        isConnected: false,
        isConnecting: false,
        error: null,
      })
      return
    }

    try {
      initializeSocket(token)
    } catch (error) {
      console.error('Failed to initialize socket:', error)
      setConnectionState({
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      })
      return
    }

    const unsubscribe = onConnectionStateChange((state) => {
      setConnectionState(state)
    })

    setConnectionState(getConnectionState())

    return () => {
      unsubscribe()
    }
  }, [token])

  const socket = getSocket()

  return {
    socket,
    isConnected: connectionState.isConnected,
    isConnecting: connectionState.isConnecting,
    error: connectionState.error,
    sendMessage: (message: any, callback?: (response: any) => void) => {
      emitSendMessage(message.conversationId, message.content, message.attachments, callback)
    },
    joinRoom: (roomId: string) => emitJoinRoom(roomId),
    leaveRoom: (roomId: string) => emitLeaveRoom(roomId),
    setTyping: (conversationId: string, isTyping: boolean) => {
      emitTypingIndicator(conversationId, isTyping)
    },
  }
}

/**
 * Hook for chat operations in a specific conversation
 * Automatically subscribes to conversation on mount
 * @param conversationId - ID of the conversation
 * @returns Socket utilities for chat operations
 */
export function useChat(conversationId?: string) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return

    // Subscribe to conversation
    emitSubscribeConversation(conversationId)

    return () => {
      // Unsubscribe from conversation
      emitLeaveRoom(conversationId)
    }
  }, [socket, isConnected, conversationId])

  return {
    socket,
    isConnected,
    sendMessage: (message: string, attachments?: any[]) => {
      if (conversationId) {
        emitSendMessage(conversationId, message, attachments)
      }
    },
    joinRoom: (roomId: string) => emitJoinRoom(roomId),
    leaveRoom: (roomId: string) => emitLeaveRoom(roomId),
    setTyping: (isTyping: boolean) => {
      if (conversationId) {
        emitTypingIndicator(conversationId, isTyping)
      }
    },
    markRead: (messageId: string) => {
      if (conversationId) {
        emitMarkRead(messageId, conversationId)
      }
    },
  }
}

/**
 * Hook for subscribing to a specific conversation
 * @param conversationId - ID of the conversation to subscribe to
 */
export function useSubscribeConversation(conversationId: string) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return

    emitSubscribeConversation(conversationId)

    return () => {
      emitLeaveRoom(conversationId)
    }
  }, [socket, isConnected, conversationId])
}

/**
 * Hook for sending typing indicators in a conversation
 * @param conversationId - ID of the conversation
 * @returns Function to set typing state
 */
export function useTypingIndicator(conversationId: string) {
  const { isConnected } = useSocket()

  return (isTyping: boolean) => {
    if (isConnected && conversationId) {
      emitTypingIndicator(conversationId, isTyping)
    }
  }
}

/**
 * Hook for marking messages as read
 * @param conversationId - ID of the conversation
 * @returns Function to mark message as read
 */
export function useMarkRead(conversationId: string) {
  const { isConnected } = useSocket()

  return (messageId: string) => {
    if (isConnected && conversationId) {
      emitMarkRead(messageId, conversationId)
    }
  }
}

/**
 * Hook for broadcasting presence/online status
 * @returns Function to set online status
 */
export function usePresence() {
  const { isConnected } = useSocket()

  return (status: 'online' | 'away' | 'offline') => {
    if (isConnected) {
      emitSetOnline(status)
    }
  }
}
