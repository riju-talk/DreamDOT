import { create } from "zustand"

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: "text" | "image" | "file"
  attachments?: Array<{ url: string; name: string; type: string }>
  readBy: string[]
  timestamp: Date
  isDeleted: boolean
}

interface Conversation {
  id: string
  type: "direct" | "group"
  name?: string
  participants: string[]
  lastMessage?: Message
  lastMessageAt: Date
  unreadCount: number
  avatar?: string
}

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>
  typingUsers: Record<string, string[]>
  onlineUsers: Set<string>
  isLoading: boolean
  error: string | null

  // Actions
  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (conversationId: string | null) => void
  addMessage: (message: Message) => void
  addMessages: (conversationId: string, messages: Message[]) => void
  setTypingUser: (conversationId: string, userId: string) => void
  removeTypingUser: (conversationId: string, userId: string) => void
  setOnlineUser: (userId: string) => void
  removeOnlineUser: (userId: string) => void
  setUnreadCount: (conversationId: string, count: number) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Getters
  getActiveConversation: () => Conversation | undefined
  getActiveMessages: () => Message[]
  getUnreadTotal: () => number
  isUserOnline: (userId: string) => boolean
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  isLoading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversationId) =>
    set({
      activeConversationId: conversationId,
      error: null,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [message.conversationId]: [
          ...(state.messages[message.conversationId] || []),
          message,
        ],
      },
    })),

  addMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  setTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: [
          ...(state.typingUsers[conversationId] || []).filter((id) => id !== userId),
          userId,
        ],
      },
    })),

  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] || []).filter(
          (id) => id !== userId
        ),
      },
    })),

  setOnlineUser: (userId) =>
    set((state) => {
      const newOnline = new Set(state.onlineUsers)
      newOnline.add(userId)
      return { onlineUsers: newOnline }
    }),

  removeOnlineUser: (userId) =>
    set((state) => {
      const newOnline = new Set(state.onlineUsers)
      newOnline.delete(userId)
      return { onlineUsers: newOnline }
    }),

  setUnreadCount: (conversationId, count) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: count } : conv
      ),
    })),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  getActiveConversation: () => {
    const state = get()
    return state.conversations.find(
      (conv) => conv.id === state.activeConversationId
    )
  },

  getActiveMessages: () => {
    const state = get()
    return state.activeConversationId
      ? state.messages[state.activeConversationId] || []
      : []
  },

  getUnreadTotal: () => {
    const state = get()
    return state.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
  },

  isUserOnline: (userId) => {
    const state = get()
    return state.onlineUsers.has(userId)
  },
}))

console.log("[Store] useChatStore initialized")
