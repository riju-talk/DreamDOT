# Phase 4: Chat/Messaging & Communities

**Duration:** Estimated 2-3 hours  
**Priority:** HIGH - Core social feature

---

## Overview

Phase 4 implements real-time chat with Socket.IO and text-only communities (Discord-style servers).

**Key Features:**
- Direct messages & group conversations
- Real-time updates via Socket.IO
- Typing indicators & read receipts
- Text-only channels (no voice)
- Live presence indicators
- File/image attachments

---

## Task 4.1: Create Messages Main Page
**File:** `apps/web/src/app/messages/page.tsx`

**Layout:**
```
MessagesPage
├── ConversationList (left sidebar)
│   ├── SearchBar
│   ├── ConversationItem[] (with unread badges)
│   └── NewConversationButton
└── ConversationPanel (right side)
    ├── ConversationHeader
    ├── MessageList (scrollable)
    ├── MessageInput
    └── TypingIndicator
```

**Implementation:**
1. Create page component
2. Fetch conversations from API
3. Setup Socket.IO connection
4. Listen for new messages in real-time
5. Display messages with timestamps

**Dependencies:**
- Socket.IO client library
- API endpoint: `GET /api/conversations`
- useChat Zustand store

---

## Task 4.2: Create Zustand Chat Store
**File:** `apps/web/src/lib/store/useChatStore.ts`

**State:**
```typescript
interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>
  typingUsers: Record<string, string[]>
  onlineUsers: string[]
  unreadCounts: Record<string, number>
  isLoading: boolean
  error: string | null
  
  setActiveConversation: (id) => void
  addMessage: (conversationId, message) => void
  setTypingUser: (conversationId, userId) => void
  removeTypingUser: (conversationId, userId) => void
  setOnlineUser: (userId) => void
  removeOnlineUser: (userId) => void
  setUnreadCount: (conversationId, count) => void
}
```

**Implementation:**
1. Create store with selectors for performance
2. Add Socket.IO event listeners
3. Implement optimistic updates
4. Handle disconnection/reconnection
5. Add error recovery

---

## Task 4.3: Create Conversation Item Component
**File:** `apps/web/src/app/messages/components/ConversationItem.tsx`

**Features:**
- Show participant avatar(s)
- Show conversation name/title
- Show last message preview
- Show timestamp of last message
- Show unread badge with count
- Show online/offline status
- Highlight active conversation

**Implementation:**
1. Create list item component
2. Add click handler to select conversation
3. Show unread indicator
4. Show typing indicator if someone typing
5. Add hover effects

---

## Task 4.4: Create Message List Component
**File:** `apps/web/src/app/messages/components/MessageList.tsx`

**Features:**
- Display messages in chronological order
- Group messages by day
- Show sender avatar & name
- Show timestamp on hover
- Show read receipts (✓ or ✓✓)
- Handle different message types (text, image, file)
- Auto-scroll to latest message
- Implement virtual scrolling for performance

**Implementation:**
1. Create scrollable message list
2. Render messages with proper styling
3. Add read receipt indicators
4. Add timestamp grouping
5. Implement infinite scroll (load older messages)

**Dependencies:**
- react-window (virtual scrolling)
- date-fns (timestamp formatting)

---

## Task 4.5: Create Message Input Component
**File:** `apps/web/src/app/messages/components/MessageInput.tsx`

**Features:**
- Text input field with auto-resize
- File/image attachment button
- Emoji picker
- Send button
- Typing indicator (sends to server every 3s)
- Preview attached files
- Max 4000 chars

**Implementation:**
1. Create textarea input
2. Add auto-resize logic
3. Add file upload handler
4. Send typing indicator
5. Emit message to Socket.IO
6. Clear input on send

**Dependencies:**
- ImageKit for file uploads
- emoji-picker library

---

## Task 4.6: Create Conversation Header
**File:** `apps/web/src/app/messages/components/ConversationHeader.tsx`

**Features:**
- Show conversation title
- Show participant avatars/count
- Show online status
- Add menu button (info, mute, block, leave)
- Show search in conversation button

**Implementation:**
1. Create header component
2. Display conversation info
3. Add action buttons
4. Show online indicators

---

## Task 4.7: Create Socket.IO Configuration
**File:** `apps/web/src/lib/socket.ts`

**Implementation:**
1. Initialize Socket.IO connection
2. Setup event listeners:
   - `message:receive` - new message
   - `message:read` - message read
   - `typing:start` - user typing
   - `typing:stop` - user stopped typing
   - `presence:join` - user online
   - `presence:leave` - user offline
   - `error` - connection error
3. Setup event emitters:
   - `message:send` - send message
   - `conversation:subscribe` - join conversation room
   - `typing:indicator` - send typing status
4. Handle reconnection
5. Implement exponential backoff

**Dependencies:**
- socket.io-client library

---

## Task 4.8: Create Chat API Endpoints

### Endpoint 1: Get Conversations
**File:** `apps/web/src/app/api/conversations/route.js`
**Endpoint:** `GET /api/conversations`
**Response:** Array of conversations with last message

### Endpoint 2: Get Messages for Conversation
**File:** `apps/web/src/app/api/conversations/[id]/messages/route.js`
**Endpoint:** `GET /api/conversations/[id]/messages`
**Response:** Array of messages with pagination

### Endpoint 3: Send Message
**File:** `apps/web/src/app/api/conversations/[id]/messages/route.js`
**Endpoint:** `POST /api/conversations/[id]/messages`
**Input:** Message text, attachments
**Response:** Created message

### Endpoint 4: Create Conversation
**File:** `apps/web/src/app/api/conversations/route.js`
**Endpoint:** `POST /api/conversations`
**Input:** Participant IDs, is_group
**Response:** Created conversation

---

## Task 4.9: Create Communities/Servers Page
**File:** `apps/web/src/app/communities/page.tsx`

**Structure:**
```
CommunitiesPage
├── ServerList (left sidebar)
│   ├── ServerItem[] (with icons)
│   ├── CreateServerButton
│   └── DiscoverButton
└── ServerPanel (right side)
    ├── ChannelList
    ├── MemberList
    ├── ChatArea (text channels only)
    └── ServerSettings
```

**Implementation:**
1. Create page component
2. Fetch servers from API
3. Display channels (TEXT ONLY)
4. Show members with live status
5. Implement chat in selected channel

**Key Rule:** Only TEXT channels allowed - no voice/stage channels

**Dependencies:**
- API endpoint: `GET /api/servers`
- API endpoint: `GET /api/servers/[id]/channels`

---

## Task 4.10: Create Channel Item Component
**File:** `apps/web/src/app/communities/components/ChannelItem.tsx`

**Features:**
- Show channel name
- Show channel type icon (# for text)
- Highlight active channel
- Show unread message count
- Add right-click context menu

**Validation:**
- ONLY show channels with `type: 'text'`
- NEVER show voice/stage channels in UI

---

## Task 4.11: Create Live Presence Component
**File:** `apps/web/src/app/communities/components/LivePresence.tsx`

**Features:**
- Show online status next to user names
- Green dot for online, gray for offline
- Show "Currently Online" tooltip
- Update in real-time

**Implementation:**
1. Use Socket.IO presence events
2. Display indicator next to user
3. Update on presence changes
4. Show online count

---

## Acceptance Criteria

✅ Socket.IO connection working  
✅ Real-time messages working  
✅ Typing indicators working  
✅ Read receipts working  
✅ Presence indicators working  
✅ Text channels only (no voice)  
✅ File attachments working  
✅ Conversations list displaying correctly  
✅ No console errors  

---

## Testing Checklist

- [ ] Connect to Socket.IO successfully
- [ ] Send message in conversation
- [ ] Message appears in real-time
- [ ] See typing indicator
- [ ] See read receipts
- [ ] Go online/offline shows in presence
- [ ] Upload and send file attachment
- [ ] Create new conversation
- [ ] Create server
- [ ] Create text channel
- [ ] Verify NO voice channels can be created
- [ ] See online count
- [ ] Test on multiple browser tabs (real-time sync)
- [ ] Test reconnection handling

