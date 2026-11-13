import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useChatStore, type Message, type Conversation } from './useChatStore'

// Mock Socket.IO
vi.mock('@/lib/socket', () => ({
  getSocket: vi.fn(() => null),
  emitSendMessage: vi.fn(),
  emitSubscribeConversation: vi.fn(),
  emitTypingIndicator: vi.fn(),
}))

describe('useChatStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useChatStore.setState({
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
    })
  })

  describe('Basic State Management', () => {
    it('should initialize with default state', () => {
      const store = useChatStore.getState()
      expect(store.conversations).toEqual([])
      expect(store.activeConversationId).toBeNull()
      expect(store.messages).toEqual({})
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.socketConnected).toBe(false)
    })

    it('should set active conversation', () => {
      useChatStore.getState().setActiveConversation('conv1')
      expect(useChatStore.getState().activeConversationId).toBe('conv1')
    })

    it('should set loading state', () => {
      useChatStore.getState().setLoading(true)
      expect(useChatStore.getState().isLoading).toBe(true)
    })

    it('should set error state', () => {
      const errorMsg = 'Test error'
      useChatStore.getState().setError(errorMsg)
      expect(useChatStore.getState().error).toBe(errorMsg)
    })

    it('should set socket connected state', () => {
      useChatStore.getState().setSocketConnected(true)
      expect(useChatStore.getState().socketConnected).toBe(true)
    })
  })

  describe('Conversation Management', () => {
    it('should set conversations', () => {
      const conversations: Conversation[] = [
        {
          id: 'conv1',
          participantIds: ['user1', 'user2'],
          participantNames: ['User 1', 'User 2'],
          isGroup: false,
          unreadCount: 0,
          createdAt: new Date(),
        },
      ]
      useChatStore.getState().setConversations(conversations)
      expect(useChatStore.getState().conversations).toHaveLength(1)
    })
  })

  describe('Message Management', () => {
    it('should add a message to conversation', () => {
      const message: Message = {
        id: 'msg1',
        conversationId: 'conv1',
        userId: 'user1',
        userName: 'User 1',
        text: 'Hello',
        createdAt: new Date(),
        readBy: [],
      }
      useChatStore.getState().addMessage('conv1', message)
      expect(useChatStore.getState().messages['conv1']).toHaveLength(1)
    })

    it('should add multiple messages', () => {
      const msg1: Message = {
        id: 'msg1',
        conversationId: 'conv1',
        userId: 'user1',
        userName: 'User 1',
        text: 'Hello',
        createdAt: new Date(),
        readBy: [],
      }
      const msg2: Message = {
        id: 'msg2',
        conversationId: 'conv1',
        userId: 'user2',
        userName: 'User 2',
        text: 'Hi',
        createdAt: new Date(),
        readBy: [],
      }
      useChatStore.getState().addMessage('conv1', msg1)
      useChatStore.getState().addMessage('conv1', msg2)
      expect(useChatStore.getState().messages['conv1']).toHaveLength(2)
    })

    it('should set messages for conversation', () => {
      const messages: Message[] = [
        {
          id: 'msg1',
          conversationId: 'conv1',
          userId: 'user1',
          userName: 'User 1',
          text: 'Hello',
          createdAt: new Date(),
          readBy: [],
        },
      ]
      useChatStore.getState().setMessages('conv1', messages)
      expect(useChatStore.getState().messages['conv1']).toHaveLength(1)
    })

    it('should handle optimistic updates', () => {
      const optimisticMessage: Message = {
        id: 'temp-msg1',
        conversationId: 'conv1',
        userId: 'user1',
        userName: 'User 1',
        text: 'Sending...',
        createdAt: new Date(),
        readBy: [],
        isOptimistic: true,
      }
      useChatStore.getState().addMessage('conv1', optimisticMessage)
      expect(useChatStore.getState().messages['conv1'][0].isOptimistic).toBe(true)
    })
  })

  describe('Typing Users', () => {
    it('should add typing user', () => {
      useChatStore.getState().setTypingUser('conv1', 'user1')
      expect(useChatStore.getState().typingUsers['conv1']).toContain('user1')
    })

    it('should not add duplicates', () => {
      useChatStore.getState().setTypingUser('conv1', 'user1')
      useChatStore.getState().setTypingUser('conv1', 'user1')
      expect(useChatStore.getState().typingUsers['conv1']).toHaveLength(1)
    })

    it('should remove typing user', () => {
      useChatStore.getState().setTypingUser('conv1', 'user1')
      useChatStore.getState().removeTypingUser('conv1', 'user1')
      expect(useChatStore.getState().typingUsers['conv1']).toHaveLength(0)
    })
  })

  describe('Online Users', () => {
    it('should add online user', () => {
      useChatStore.getState().setOnlineUser('user1')
      expect(useChatStore.getState().onlineUsers).toContain('user1')
    })

    it('should remove online user', () => {
      useChatStore.getState().setOnlineUser('user1')
      useChatStore.getState().removeOnlineUser('user1')
      expect(useChatStore.getState().onlineUsers).toHaveLength(0)
    })
  })

  describe('Unread Counts', () => {
    it('should set unread count', () => {
      useChatStore.getState().setUnreadCount('conv1', 5)
      expect(useChatStore.getState().unreadCounts['conv1']).toBe(5)
    })

    it('should update unread count', () => {
      useChatStore.getState().setUnreadCount('conv1', 5)
      useChatStore.getState().setUnreadCount('conv1', 3)
      expect(useChatStore.getState().unreadCounts['conv1']).toBe(3)
    })
  })

  describe('Pagination Helpers', () => {
    it('should reset pagination', () => {
      useChatStore.getState().resetPagination('conv1')
      const pagination = useChatStore.getState().pagination['conv1']
      expect(pagination.hasMore).toBe(true)
      expect(pagination.page).toBe(0)
      expect(pagination.pageSize).toBe(20)
    })

    it('should check if can load more', () => {
      useChatStore.getState().resetPagination('conv1')
      expect(useChatStore.getState().canLoadMoreMessages('conv1')).toBe(true)
    })

    it('should return true for unknown pagination', () => {
      expect(useChatStore.getState().canLoadMoreMessages('unknown')).toBe(true)
    })
  })

  describe('Socket.IO Integration', () => {
    it('should have setupSocketListeners method', () => {
      expect(typeof useChatStore.getState().setupSocketListeners).toBe('function')
    })

    it('should have cleanupSocketListeners method', () => {
      expect(typeof useChatStore.getState().cleanupSocketListeners).toBe('function')
    })

    it('should not throw on setup', () => {
      expect(() => {
        useChatStore.getState().setupSocketListeners()
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty message text', () => {
      const message: Message = {
        id: 'msg1',
        conversationId: 'conv1',
        userId: 'user1',
        userName: 'User 1',
        text: '',
        createdAt: new Date(),
        readBy: [],
      }
      useChatStore.getState().addMessage('conv1', message)
      expect(useChatStore.getState().messages['conv1']).toHaveLength(1)
    })

    it('should handle attachments', () => {
      const message: Message = {
        id: 'msg1',
        conversationId: 'conv1',
        userId: 'user1',
        userName: 'User 1',
        text: 'Check this',
        attachment: { url: 'https://example.com/image.jpg', type: 'image' },
        createdAt: new Date(),
        readBy: [],
      }
      useChatStore.getState().addMessage('conv1', message)
      expect(useChatStore.getState().messages['conv1'][0].attachment).toBeDefined()
    })

    it('should handle read receipts', () => {
      const message: Message = {
        id: 'msg1',
        conversationId: 'conv1',
        userId: 'user1',
        userName: 'User 1',
        text: 'Hello',
        createdAt: new Date(),
        readBy: ['user2', 'user3'],
      }
      useChatStore.getState().addMessage('conv1', message)
      expect(useChatStore.getState().messages['conv1'][0].readBy).toHaveLength(2)
    })

    it('should keep conversations separate', () => {
      const msg1: Message = {
        id: 'msg1',
        conversationId: 'conv1',
        userId: 'user1',
        userName: 'User 1',
        text: 'In conv1',
        createdAt: new Date(),
        readBy: [],
      }
      const msg2: Message = {
        id: 'msg2',
        conversationId: 'conv2',
        userId: 'user1',
        userName: 'User 1',
        text: 'In conv2',
        createdAt: new Date(),
        readBy: [],
      }
      useChatStore.getState().addMessage('conv1', msg1)
      useChatStore.getState().addMessage('conv2', msg2)
      expect(useChatStore.getState().messages['conv1']).toHaveLength(1)
      expect(useChatStore.getState().messages['conv2']).toHaveLength(1)
    })
  })
})
