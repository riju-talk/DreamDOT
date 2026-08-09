
"use client"

import { io, Socket } from 'socket.io-client'

// ============================================================================
// Socket.IO Configuration Module
// ============================================================================
// Initializes Socket.IO client with connection pooling, reconnection logic,
// event listeners, and emitters for real-time chat features.
// ============================================================================

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3001'

// Reconnection configuration with exponential backoff
const RECONNECTION_CONFIG = {
  reconnection: true,
  reconnectionDelay: 1000, // Start with 1 second
  reconnectionDelayMax: 5000, // Max 5 seconds
  reconnectionAttempts: 5,
  randomizationFactor: 0.1,
}

/**
 * Socket.IO Instance
 * Exported singleton instance for use throughout the application
 */
let socketInstance: Socket | null = null

/**
 * Connection state tracking
 */
interface SocketConnectionState {
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
}

let connectionState: SocketConnectionState = {
  isConnected: false,
  isConnecting: false,
  error: null,
}

/**
 * Connection state listeners
 */
const connectionStateListeners: Set<(state: SocketConnectionState) => void> = new Set()

/**
 * Initialize Socket.IO client with authentication token
 * @param token - JWT authentication token from NextAuth session
 * @returns Socket instance
 */
export function initializeSocket(token: string): Socket {
  if (socketInstance && socketInstance.connected) {
    return socketInstance
  }

  connectionState.isConnecting = true

  socketInstance = io(CHAT_SERVER_URL, {
    auth: {
      token,
    },
    reconnection: RECONNECTION_CONFIG.reconnection,
    reconnectionDelay: RECONNECTION_CONFIG.reconnectionDelay,
    reconnectionDelayMax: RECONNECTION_CONFIG.reconnectionDelayMax,
    reconnectionAttempts: RECONNECTION_CONFIG.reconnectionAttempts,
    randomizationFactor: RECONNECTION_CONFIG.randomizationFactor,
    autoConnect: true,
    transports: ['websocket', 'polling'],
  })

  // ============================================================================
  // Connection Event Listeners
  // ============================================================================

  socketInstance.on('connect', () => {
    console.log('[Socket] Connected to chat server')
    connectionState = {
      isConnected: true,
      isConnecting: false,
      error: null,
    }
    notifyConnectionStateListeners()
  })

  socketInstance.on('disconnect', () => {
    console.log('[Socket] Disconnected from chat server')
    connectionState = {
      isConnected: false,
      isConnecting: false,
      error: null,
    }
    notifyConnectionStateListeners()
  })

  socketInstance.on('connect_error', (error: Error) => {
    console.error('[Socket] Connection error:', error)
    connectionState = {
      isConnected: false,
      isConnecting: false,
      error,
    }
    notifyConnectionStateListeners()
  })

  socketInstance.on('reconnect_attempt', () => {
    console.log('[Socket] Attempting to reconnect...')
    connectionState.isConnecting = true
    notifyConnectionStateListeners()
  })

  socketInstance.on('reconnect_error', (error: Error) => {
    console.error('[Socket] Reconnection error:', error)
    connectionState.error = error
    notifyConnectionStateListeners()
  })

  // ============================================================================
  // Message Event Listeners
  // ============================================================================

  // NOTE: apps/chat/server.js broadcasts 'message:new' (DMs) and 'channel:message:new'
  // (community channels) — not 'message:receive', which nothing on the server ever
  // emits. These listeners are log-only; useChatStore.setupSocketListeners() is what
  // actually applies the data to state.
  socketInstance.on('message:new', (data: any) => {
    console.log('[Socket] Message received:', data)
  })

  socketInstance.on('channel:message:new', (data: any) => {
    console.log('[Socket] Channel message received:', data)
  })

  socketInstance.on('typing:start', (data: any) => {
    console.log('[Socket] User typing started:', data)
    // Typing indicator started - handled by Zustand store
  })

  socketInstance.on('typing:stop', (data: any) => {
    console.log('[Socket] User typing stopped:', data)
    // Typing indicator stopped - handled by Zustand store
  })

  // ============================================================================
  // Presence Event Listeners
  // ============================================================================

  socketInstance.on('presence:join', (data: any) => {
    console.log('[Socket] User came online:', data)
    // User joined (came online) - handled by Zustand store
  })

  socketInstance.on('presence:leave', (data: any) => {
    console.log('[Socket] User went offline:', data)
    // User left (went offline) - handled by Zustand store
  })

  // ============================================================================
  // Read Receipt Event Listeners
  // ============================================================================

  socketInstance.on('read-receipt:update', (data: any) => {
    console.log('[Socket] Read receipt received:', data)
    // Read receipt - handled by Zustand store
  })

  // ============================================================================
  // Error Handling
  // ============================================================================

  socketInstance.on('error', (error: Error) => {
    console.error('[Socket] Error:', error)
    connectionState.error = error
    notifyConnectionStateListeners()
  })

  return socketInstance
}

/**
 * Get the current Socket.IO instance
 * @returns Socket instance or null if not initialized
 */
export function getSocket(): Socket | null {
  return socketInstance
}

/**
 * Get current connection state
 * @returns Current connection state
 */
export function getConnectionState(): SocketConnectionState {
  return { ...connectionState }
}

/**
 * Subscribe to connection state changes
 * @param listener - Callback function for connection state changes
 * @returns Unsubscribe function
 */
export function onConnectionStateChange(
  listener: (state: SocketConnectionState) => void
): () => void {
  connectionStateListeners.add(listener)
  return () => {
    connectionStateListeners.delete(listener)
  }
}

/**
 * Notify all listeners of connection state change
 */
function notifyConnectionStateListeners() {
  const state = { ...connectionState }
  connectionStateListeners.forEach((listener) => {
    try {
      listener(state)
    } catch (error) {
      console.error('Error in connection state listener:', error)
    }
  })
}

/**
 * Disconnect Socket.IO client
 */
export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
    connectionState = {
      isConnected: false,
      isConnecting: false,
      error: null,
    }
    notifyConnectionStateListeners()
  }
}

// ============================================================================
// Socket.IO Event Emitters
// ============================================================================

/**
 * Send a message through Socket.IO
 * @param conversationId - ID of the conversation
 * @param message - Message content
 * @param attachments - Optional file attachments
 */
export function emitSendMessage(
  conversationId: string,
  message: string,
  attachments?: any[]
): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting message:send', { conversationId, message })
    // Field name must be `content` — apps/chat/server.js's message:send handler
    // reads `content`/`ciphertext`, never a `message` field.
    socketInstance.emit('message:send', {
      conversationId,
      content: message,
      attachments,
      timestamp: new Date().toISOString(),
    })
  } else {
    console.warn('[Socket] Cannot emit message:send - socket not connected', {
      isConnected: connectionState.isConnected,
    })
  }
}

/**
 * Join a community channel room (parallel to emitSubscribeConversation for DMs)
 * @param channelId - ID of the channel to join
 */
export function emitJoinChannel(channelId: string): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting channel:join', { channelId })
    socketInstance.emit('channel:join', { channelId })
  } else {
    console.warn('[Socket] Cannot emit channel:join - socket not connected')
  }
}

/**
 * Leave a community channel room
 * @param channelId - ID of the channel to leave
 */
export function emitLeaveChannel(channelId: string): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting channel:leave', { channelId })
    socketInstance.emit('channel:leave', { channelId })
  } else {
    console.warn('[Socket] Cannot emit channel:leave - socket not connected')
  }
}

/**
 * Send a message to a community channel through Socket.IO
 * @param channelId - ID of the channel
 * @param content - Message content
 * @param attachments - Optional file attachments
 */
export function emitSendChannelMessage(channelId: string, content: string, attachments?: any[]): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting channel:message:send', { channelId, content })
    socketInstance.emit('channel:message:send', { channelId, content, attachments })
  } else {
    console.warn('[Socket] Cannot emit channel:message:send - socket not connected')
  }
}

/**
 * Subscribe to a conversation
 * @param conversationId - ID of the conversation to subscribe to
 */
export function emitSubscribeConversation(conversationId: string): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting conversation:subscribe', { conversationId })
    socketInstance.emit('conversation:subscribe', {
      conversationId,
    })
  } else {
    console.warn('[Socket] Cannot emit conversation:subscribe - socket not connected')
  }
}

/**
 * Send typing indicator
 * @param conversationId - ID of the conversation
 * @param isTyping - Whether user is currently typing
 */
export function emitTypingIndicator(conversationId: string, isTyping: boolean): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting typing:indicator', { conversationId, isTyping })
    socketInstance.emit('typing:indicator', {
      conversationId,
      isTyping,
    })
  } else {
    console.warn('[Socket] Cannot emit typing:indicator - socket not connected')
  }
}

/**
 * Send read receipt for a message
 * @param messageId - ID of the message that was read
 * @param conversationId - ID of the conversation
 */
export function emitMarkRead(messageId: string, conversationId: string): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting read-receipt:mark', { messageId, conversationId })
    socketInstance.emit('read-receipt:mark', {
      messageId,
      conversationId,
    })
  } else {
    console.warn('[Socket] Cannot emit read-receipt:mark - socket not connected')
  }
}

/**
 * Broadcast online/presence status
 * @param status - User status (online, away, offline)
 */
export function emitSetOnline(status: 'online' | 'away' | 'offline'): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting presence:status', { status })
    socketInstance.emit('presence:status', {
      status,
      timestamp: new Date().toISOString(),
    })
  } else {
    console.warn('[Socket] Cannot emit presence:status - socket not connected')
  }
}

// ============================================================================
// Legacy compatibility functions (for backward compatibility)
// ============================================================================

/**
 * Join a conversation room (legacy function)
 * @param conversationId - ID of the conversation
 */
export function emitJoinRoom(conversationId: string): void {
  console.log('[Socket] Emitting room join (legacy)', { conversationId })
  emitSubscribeConversation(conversationId)
}

/**
 * Leave a conversation room (legacy function)
 * @param conversationId - ID of the conversation
 */
export function emitLeaveRoom(conversationId: string): void {
  if (socketInstance && connectionState.isConnected) {
    console.log('[Socket] Emitting room leave', { conversationId })
    socketInstance.emit('conversation:unsubscribe', {
      conversationId,
    })
  } else {
    console.warn('[Socket] Cannot emit conversation:unsubscribe - socket not connected')
  }
}
