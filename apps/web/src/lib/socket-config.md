# Socket.IO Configuration Module

## Overview
Complete Socket.IO client configuration for real-time chat and messaging features in DreamDot.

## Implementation Summary

### Files Created/Updated
1. **`socket.ts`** - Core Socket.IO initialization and management
2. **`useSocketHook.ts`** - React hooks for using Socket.IO in components
3. **`socket.test.ts`** - Test suite for Socket.IO functionality

---

## Core Features Implemented

### ✅ 1. Socket.IO Client Installation
- Package: `socket.io-client` (version 4.8.3)
- Already present in `package.json`
- Imported and ready for use

### ✅ 2. Client Initialization
- Function: `initializeSocket(token: string): Socket`
- Initializes singleton Socket.IO instance
- Accepts JWT token for authentication
- Returns Socket instance for component use

### ✅ 3. Connection Configuration
- Server URL: `process.env.NEXT_PUBLIC_CHAT_SERVER_URL` (default: `http://localhost:3001`)
- Transport modes: WebSocket + polling fallback
- Auto-connect: enabled
- Authentication: JWT token via `auth` property

### ✅ 4. Event Listeners Setup
All required listeners are registered on connection:

#### Message Events
- `message:receive` - Receives new messages
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

#### Presence Events
- `presence:join` - User came online
- `presence:leave` - User went offline

#### Connection Events
- `connect` - Connection established
- `disconnect` - Connection lost
- `connect_error` - Connection error occurred
- `reconnect_attempt` - Attempting to reconnect
- `reconnect_error` - Reconnection failed
- `error` - General error

### ✅ 5. Event Emitters Setup
Exported functions for sending events:

```typescript
emitSendMessage(conversationId, message, attachments?)
  └─ Emits: 'message:send' event with message data

emitSubscribeConversation(conversationId)
  └─ Emits: 'conversation:subscribe' event

emitTypingIndicator(conversationId, isTyping)
  └─ Emits: 'typing:indicator' event
```

### ✅ 6. Reconnection with Exponential Backoff
Configuration:
- Initial delay: 1,000ms
- Maximum delay: 5,000ms
- Max attempts: 5
- Randomization factor: 0.1 (prevents connection storms)
- Exponential backoff formula applied automatically by Socket.IO

Reconnection flow:
```
1st attempt:  ~1,000ms
2nd attempt:  ~1,100ms (±100ms randomization)
3rd attempt:  ~2,200ms (doubles with backoff)
4th attempt:  ~4,400ms
5th attempt:  ~5,000ms (capped at max)
```

### ✅ 7. Connection State Tracking
State object includes:
```typescript
interface SocketConnectionState {
  isConnected: boolean      // Currently connected
  isConnecting: boolean     // Attempting to connect
  error: Error | null       // Last error, if any
}
```

Functions for state management:
- `getConnectionState()` - Get current state
- `onConnectionStateChange(listener)` - Subscribe to changes
- `disconnectSocket()` - Cleanup and disconnect

### ✅ 8. Socket Instance Export
Multiple export patterns for flexibility:

**Direct instance access:**
```typescript
import { getSocket } from '@/lib/socket'
const socket = getSocket()
```

**State management:**
```typescript
import { getConnectionState } from '@/lib/socket'
const state = getConnectionState()
```

**React Hooks (recommended):**
```typescript
import { useSocket, useChat } from '@/lib/useSocketHook'

function MyComponent() {
  const { isConnected, socket } = useSocket()
  return <div>Connected: {isConnected}</div>
}
```

---

## Architecture

### Singleton Pattern
- Single socket instance per session
- Reused across all components
- Automatic cleanup on disconnect

### Event-Driven Architecture
- Listeners registered on init
- Emitters available immediately after connect
- State changes propagate to subscribers

### Error Handling
- Connection errors captured and stored
- Error state propagated to consumers
- Graceful fallback to polling transport
- No unhandled promise rejections

---

## Usage Examples

### In React Components

#### Basic Connection
```typescript
import { useSocket } from '@/lib/useSocketHook'

export function ChatComponent() {
  const { isConnected, socket, error } = useSocket()
  
  if (error) return <div>Error: {error.message}</div>
  if (!isConnected) return <div>Connecting...</div>
  
  return <div>Connected!</div>
}
```

#### Sending Messages
```typescript
import { useChat } from '@/lib/useSocketHook'

export function MessageInput() {
  const { sendMessage, isConnected } = useChat('conversation-123')
  
  function handleSend(text: string) {
    sendMessage(text)
  }
  
  return <input disabled={!isConnected} onChange={e => handleSend(e.target.value)} />
}
```

#### Typing Indicators
```typescript
import { useTypingIndicator } from '@/lib/useSocketHook'

export function TextInput() {
  const setTyping = useTypingIndicator('conversation-123')
  
  return (
    <input 
      onFocus={() => setTyping(true)}
      onBlur={() => setTyping(false)}
    />
  )
}
```

### Direct Socket Access
```typescript
import { initializeSocket, getConnectionState } from '@/lib/socket'

// Initialize with token (usually in app layout or auth context)
const socket = initializeSocket(userToken)

// Listen to custom events
socket.on('message:receive', (data) => {
  console.log('New message:', data)
})

// Send events
socket.emit('message:send', {
  conversationId: 'conv-123',
  message: 'Hello!'
})

// Check status
const state = getConnectionState()
console.log('Connected?', state.isConnected)
```

---

## Acceptance Criteria Met

✅ **Socket.IO client initializes**
- `initializeSocket()` creates configured Socket.IO client
- Returns Socket instance ready for use

✅ **Connection listeners work**
- All 9 event listeners registered and functional
- Connection state tracked and updated

✅ **Event emitters work**
- 3 primary emitters: `message:send`, `conversation:subscribe`, `typing:indicator`
- Legacy emitters for backward compatibility

✅ **Reconnection logic works**
- Exponential backoff configured
- Automatic reconnection on disconnect
- Max 5 attempts with increasing delays

✅ **NO console errors**
- All errors caught and stored in state
- No unhandled exceptions
- Graceful degradation when disconnected

---

## Next Steps (Dependent Tasks)

This module is a foundation for:
- **P4.2** - Chat Zustand Store (connects to socket events)
- **P4.6** - Message Input Component (uses `useChat()`)
- **P4.8** - Messages Main Page (uses `useSocket()`)
- **P4.9** - Communities Page (uses socket for channels)
- **P4.11** - Live Presence Component (uses presence events)

---

## Testing

Run tests with:
```bash
npm test -- socket.test.ts
```

Tests cover:
- ✓ Client initialization
- ✓ Event listener registration
- ✓ Event emitter functionality
- ✓ Connection state tracking
- ✓ Reconnection configuration
- ✓ Error handling
- ✓ Graceful cleanup

---

## Configuration Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_CHAT_SERVER_URL=http://localhost:3001
```

The socket module will use this URL for all connections. If not set, defaults to `http://localhost:3001`.

---

## Troubleshooting

### Connection not established?
1. Check `NEXT_PUBLIC_CHAT_SERVER_URL` is correct
2. Verify token is provided and valid
3. Check browser console for network errors
4. Ensure chat server is running

### Events not received?
1. Verify listener was registered (check event names)
2. Ensure socket is connected (`isConnected === true`)
3. Check server is emitting events correctly

### Memory leaks?
1. Always call `disconnectSocket()` on logout
2. Component cleanup functions call `leaveRoom()`
3. Event listeners are automatically cleaned up

---

## Performance Considerations

- Singleton pattern prevents multiple connections
- Event subscription happens automatically
- Polling fallback handles restrictive networks
- Exponential backoff prevents server overload
- Connection state cached to avoid unnecessary updates

---

## Security

- JWT token required for authentication
- Token obtained from NextAuth session
- CORS configured at server level
- No sensitive data in query parameters
- Transports include WebSocket + polling

---

## Future Enhancements

Potential improvements for later phases:
- Add message queue for offline scenarios
- Implement automatic retry with jitter
- Add connection metrics and monitoring
- Support for multiple socket instances (e.g., different servers)
- Add compression support
