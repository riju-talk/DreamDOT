'use client'

import { create } from 'zustand'
import {
  getSocket,
  emitSendMessage,
  emitSubscribeConversation,
  emitTypingIndicator,
} from '@/lib/socket'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Message {
  id: string
  conversationId: string
  userId: string
  userName: string
  text: string
  attachment?: { url: string; type: string }
  createdAt: Date
  readBy: string[]
  isOptimistic?: boolean
}

export interface Conversation {
  id: string
  participantIds: string[]
  participantNames: string[]
  name?: string
  isGroup: boolean
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
}

export interface PaginationState {
  hasMore: boolean
  page: number
  pageSize: number
  total: number
}

export interface ChatState {
  // State
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>
  typingUsers: Record<string, string[]>
  onlineUsers: string[]
  unreadCounts: Record<string, number>
  pagination: Record<string, PaginationState>
  isLoading: boolean
  error: string | null
  socketConnected: boolean

  // Actions
  setActiveConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Message) => void
  setTypingUser: (conversationId: string, userId: string) => void
  removeTypingUser: (conversationId: string, userId: string) => void
  setOnlineUser: (userId: string) => void
  removeOnlineUser: (userId: string) => void
  setUnreadCount: (conversationId: string, count: number) => void
  setConversations: (conversations: Conversation[]) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSocketConnected: (connected: boolean) => void

  // Pagination helpers
  loadMoreMessages: (conversationId: string, pageSize?: number) => Promise<void>
  resetPagination: (conversationId: string) => void
  canLoadMoreMessages: (conversationId: string) => boolean

  // Socket.IO integration
  setupSocketListeners: () => void
  cleanupSocketListeners: () => void
}

// ============================================================================
// Zustand Store Implementation
// ============================================================================

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial State
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: [],
  unreadCounts: {},
  pagination: {},
  isLoading: false,
  error: null,
  socketConnected: false,

  // ============================================================================
  // Basic Actions
  // ============================================================================

  setActiveConversation: (id) => set({ activeConversationId: id }),

  /**
   * Add message with optimistic update support
   */
  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),

  setTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: [...new Set([...(state.typingUsers[conversationId] || []), userId])],
      },
    })),

  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] || []).filter((u) => u !== userId),
      },
    })),

  setOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: [...new Set([...state.onlineUsers, userId])],
    })),

  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u !== userId),
    })),

  setUnreadCount: (conversationId, count) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: count,
      },
    })),

  setConversations: (conversations) => set({ conversations }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setSocketConnected: (connected) => set({ socketConnected: connected }),

  // ============================================================================
  // Pagination Helpers
  // ============================================================================

  /**
   * Load more messages for a conversation with pagination support
   */
  loadMoreMessages: async (conversationId: string, pageSize: number = 20) => {
    const state = get()
    const paginationState = state.pagination[conversationId] || {
      hasMore: true,
      page: 0,
      pageSize,
      total: 0,
    }

    if (!paginationState.hasMore) {
      return
    }

    try {
      set({ isLoading: true, error: null })

      const response = await fetch(
        `/api/conversations/${conversationId}/messages?page=${paginationState.page + 1}&pageSize=${pageSize}`
      )

      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.statusText}`)
      }

      const data = await response.json()
      const newMessages = data.messages || []

      set((state) => {
        const existingMessages = state.messages[conversationId] || []
        // Prepend new messages to maintain chronological order
        const allMessages = [...newMessages, ...existingMessages]

        // Remove duplicates by ID
        const uniqueMessages = Array.from(
          new Map(allMessages.map((msg) => [msg.id, msg])).values()
        )

        return {
          messages: {
            ...state.messages,
            [conversationId]: uniqueMessages,
          },
          pagination: {
            ...state.pagination,
            [conversationId]: {
              hasMore: data.hasMore ?? false,
              page: paginationState.page + 1,
              pageSize,
              total: data.total ?? 0,
            },
          },
        }
      })

      set({ isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ isLoading: false, error: errorMessage })
    }
  },

  /**
   * Reset pagination state for a conversation
   */
  resetPagination: (conversationId: string) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        [conversationId]: {
          hasMore: true,
          page: 0,
          pageSize: 20,
          total: 0,
        },
      },
    })),

  /**
   * Check if more messages can be loaded
   */
  canLoadMoreMessages: (conversationId: string) => {
    const state = get()
    const paginationState = state.pagination[conversationId]
    return paginationState?.hasMore ?? true
  },

  // ============================================================================
  // Socket.IO Integration
  // ============================================================================

  /**
   * Setup Socket.IO event listeners for real-time updates
   */
  setupSocketListeners: () => {
    const socket = getSocket()

    if (!socket) {
      console.warn('Socket.IO not initialized')
      return
    }

    // Listen for new messages
    socket.on('message:receive', (data: any) => {
      const { conversationId, message } = data
      if (conversationId && message) {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: [...(state.messages[conversationId] || []), message],
          },
        }))
      }
    })

    // Listen for typing indicators
    socket.on('typing:start', (data: any) => {
      const { conversationId, userId } = data
      if (conversationId && userId) {
        get().setTypingUser(conversationId, userId)
      }
    })

    socket.on('typing:stop', (data: any) => {
      const { conversationId, userId } = data
      if (conversationId && userId) {
        get().removeTypingUser(conversationId, userId)
      }
    })

    // Listen for presence events
    socket.on('presence:join', (data: any) => {
      const { userId } = data
      if (userId) {
        get().setOnlineUser(userId)
      }
    })

    socket.on('presence:leave', (data: any) => {
      const { userId } = data
      if (userId) {
        get().removeOnlineUser(userId)
      }
    })

    // Update socket connection state
    socket.on('connect', () => {
      set({ socketConnected: true })
    })

    socket.on('disconnect', () => {
      set({ socketConnected: false })
    })
  },

  /**
   * Cleanup Socket.IO event listeners
   */
  cleanupSocketListeners: () => {
    const socket = getSocket()

    if (!socket) {
      return
    }

    socket.off('message:receive')
    socket.off('typing:start')
    socket.off('typing:stop')
    socket.off('presence:join')
    socket.off('presence:leave')
    socket.off('connect')
    socket.off('disconnect')
  },
}))

// ============================================================================
// Performance-Optimized Selectors
// ============================================================================

/**
 * Select messages for active conversation only
 */
export const selectActiveConversationMessages = (state: ChatState) => {
  const { activeConversationId, messages } = state
  return activeConversationId ? messages[activeConversationId] || [] : []
}

/**
 * Select typing users in active conversation
 */
export const selectActiveConversationTypingUsers = (state: ChatState) => {
  const { activeConversationId, typingUsers } = state
  return activeConversationId ? typingUsers[activeConversationId] || [] : []
}

/**
 * Select unread count for a specific conversation
 */
export const selectConversationUnreadCount = (conversationId: string) => (state: ChatState) => {
  return state.unreadCounts[conversationId] || 0
}

/**
 * Select total unread count across all conversations
 */
export const selectTotalUnreadCount = (state: ChatState) => {
  return Object.values(state.unreadCounts).reduce((total, count) => total + count, 0)
}

/**
 * Select online status for a specific user
 */
export const selectIsUserOnline = (userId: string) => (state: ChatState) => {
  return state.onlineUsers.includes(userId)
}

/**
 * Select socket connection status
 */
export const selectSocketConnected = (state: ChatState) => state.socketConnected

/**
 * Select pagination state for a conversation
 */
export const selectConversationPagination = (conversationId: string) => (state: ChatState) => {
  return state.pagination[conversationId] || {
    hasMore: true,
    page: 0,
    pageSize: 20,
    total: 0,
  }
}
