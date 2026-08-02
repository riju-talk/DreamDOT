# Phase 4: Chat & Communities - Tasks

## P4.1: Socket.IO Client Configuration
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 30 min
- **Status:** not_started

**File:** `apps/web/src/lib/socket.ts`

**Subtasks:**
1. Install socket.io-client
2. Create socket instance
3. Connect to server on mount
4. Handle connection/disconnection events
5. Emit/listen for: message, typing, read-receipt, presence
6. Reconnect logic with exponential backoff
7. Export socket instance

**Acceptance Criteria:**
✅ Socket connects on app load
✅ Auto-reconnect works
✅ Event listeners registered
✅ NO console errors

---

## P4.2: Chat/Messages Page (Conversations List + Chat Panel)
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 40 min
- **Status:** not_started

**File:** `apps/web/src/app/messages/page.tsx`

**Subtasks:**
1. Create 2-column layout (conversations list + chat panel)
2. Fetch conversations list (GET /api/conversations)
3. Display conversations with unread badges
4. Handle conversation selection
5. Show active conversation in right panel
6. Load messages for selected conversation
7. Show typing indicators
8. Show read receipts
9. Show presence indicators
10. Connect to useChatStore

**Acceptance Criteria:**
✅ Layout responsive (1 col on mobile, 2 on desktop)
✅ Conversations load
✅ Selection works
✅ Typing indicators appear
✅ Read receipts show
✅ Presence shows (online/offline)
✅ NO console errors

---

## P4.3: API Endpoints (Conversations & Messages)
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 40 min
- **Status:** not_started

**Files:**
- `apps/web/src/app/api/conversations/route.js`
- `apps/web/src/app/api/conversations/[id]/messages/route.js`
- `apps/web/src/app/api/messages/route.js` (POST for sending)

**Subtasks:**
1. GET /api/conversations - List user conversations with pagination
2. GET /api/conversations/[id]/messages - Get conversation messages with pagination
3. POST /api/messages - Create new message
4. Validate auth, user ID, message content
5. Update unread counts
6. Handle errors with proper status codes
7. Add logging

**Acceptance Criteria:**
✅ All endpoints return proper responses
✅ Pagination works
✅ Auth checked
✅ Unread counts accurate
✅ Errors handled (400, 401, 404, 500)
✅ Logging in place

---

## P4.4: ConversationItem Component
- **Dependencies:** [P4.2]
- **Optional:** false
- **Est. Time:** 20 min
- **Status:** not_started

**File:** `apps/web/src/app/messages/components/ConversationItem.tsx`

**Subtasks:**
1. Display conversation avatar(s)
2. Show last message preview
3. Show timestamp
4. Show unread badge (count)
5. Highlight when selected
6. Show online status indicator
7. Handle click to select
8. Connect to store

**Acceptance Criteria:**
✅ All elements display
✅ Unread badge shows count
✅ Selected state highlights
✅ Online indicator accurate
✅ Click selects conversation

---

## P4.5: MessageList Component with Virtual Scroll
- **Dependencies:** [P4.3]
- **Optional:** false
- **Est. Time:** 50 min
- **Status:** not_started

**File:** `apps/web/src/app/messages/components/MessageList.tsx`

**Subtasks:**
1. Fetch messages for conversation
2. Implement virtual scrolling (react-window or similar)
3. Load older messages on scroll up (infinite scroll)
4. Display message bubbles with content
5. Show sender avatar + name
6. Show timestamp
7. Show read receipts (checkmarks)
8. Show typing indicator
9. Group messages by sender
10. Handle message loading states

**Acceptance Criteria:**
✅ Virtual scroll loads messages efficiently
✅ Infinite scroll loads history
✅ Read receipts show
✅ Typing indicator animates
✅ Messages grouped by sender
✅ NO console errors
✅ Performance smooth (60fps)

---

## P4.6: MessageInput Component
- **Dependencies:** [P4.2]
- **Optional:** false
- **Est. Time:** 30 min
- **Status:** not_started

**File:** `apps/web/src/app/messages/components/MessageInput.tsx`

**Subtasks:**
1. Create textarea input
2. Emit typing event to socket
3. Handle Enter to send (Shift+Enter for new line)
4. Add file upload button
5. Show upload progress
6. Support emoji picker (optional)
7. Clear input after send
8. Show character count
9. Connect to store
10. Validate input before send

**Acceptance Criteria:**
✅ Typing indicator emits
✅ Enter sends message
✅ File upload works
✅ Input clears after send
✅ NO console errors

---

## P4.7: ConversationHeader Component
- **Dependencies:** [P4.2]
- **Optional:** false
- **Est. Time:** 20 min
- **Status:** not_started

**File:** `apps/web/src/app/messages/components/ConversationHeader.tsx`

**Subtasks:**
1. Show conversation name/title
2. Show participant avatars
3. Show online status
4. Add search button (messages within conversation)
5. Add options menu (mute/archive/delete)
6. Show last active time
7. Connect to store

**Acceptance Criteria:**
✅ All elements display
✅ Avatars show correctly
✅ Online status accurate
✅ Menu functional
✅ NO console errors

---

## P4.8: LivePresence Component
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 15 min
- **Status:** not_started

**File:** `apps/web/src/app/messages/components/LivePresence.tsx`

**Subtasks:**
1. Display online users in conversation
2. Show user avatar + name
3. Show typing status if typing
4. Update in real-time via socket
5. Show presence indicator (green dot)
6. Handle user join/leave

**Acceptance Criteria:**
✅ Displays online users
✅ Updates in real-time
✅ Shows typing status
✅ Presence indicators accurate
✅ NO console errors

---

## P4.9: Communities/Servers Page
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 30 min
- **Status:** not_started

**File:** `apps/web/src/app/communities/page.tsx`

**Subtasks:**
1. Fetch user's communities (GET /api/servers)
2. Display communities list + server selection
3. Show channels for selected server (TEXT ONLY)
4. Display channel list with activity indicators
5. Handle channel selection
6. Load messages for selected channel
7. Show channel info (member count, description)
8. Connect to store
9. Add create server button

**Acceptance Criteria:**
✅ Communities load
✅ Channels display (TEXT ONLY)
✅ Channel selection works
✅ Messages load for channel
✅ NO voice/stage channels allowed
✅ NO console errors

---

## P4.10: ChannelItem Component
- **Dependencies:** [P4.9]
- **Optional:** false
- **Est. Time:** 15 min
- **Status:** not_started

**File:** `apps/web/src/app/communities/components/ChannelItem.tsx`

**Subtasks:**
1. Display channel name with # prefix
2. Show channel activity indicator (unread count)
3. Show member count
4. Highlight when selected
5. Show channel type (text only)
6. Handle click to select
7. Connect to store

**Acceptance Criteria:**
✅ Channel name displays
✅ Activity indicator shows
✅ Selected state highlights
✅ Click selects channel
✅ Text-only enforcement visible

---

## P4.11: Communities API Endpoints
- **Dependencies:** None
- **Optional:** false
- **Est. Time:** 35 min
- **Status:** not_started

**Files:**
- `apps/web/src/app/api/servers/route.js`
- `apps/web/src/app/api/servers/[id]/channels/route.js`
- `apps/web/src/app/api/channels/[id]/messages/route.js`

**Subtasks:**
1. GET /api/servers - List user communities
2. GET /api/servers/[id]/channels - List server channels (text-only validation)
3. GET /api/channels/[id]/messages - Get channel messages with pagination
4. POST /api/channels/[id]/messages - Create channel message
5. Validate text-only type (reject voice/stage)
6. Auth check on all endpoints
7. Proper error handling
8. Add logging

**Acceptance Criteria:**
✅ All endpoints functional
✅ Text-only enforcement at API level
✅ Pagination works
✅ Auth checked
✅ Errors handled
✅ Logging in place

---

## Summary

| Task | Type | Dependencies | Est. Time | Status |
|------|------|--------------|-----------|--------|
| P4.1 | Config | - | 30m | not_started |
| P4.2 | Page | - | 40m | not_started |
| P4.3 | API | - | 40m | not_started |
| P4.4 | Component | P4.2 | 20m | not_started |
| P4.5 | Component | P4.3 | 50m | not_started |
| P4.6 | Component | P4.2 | 30m | not_started |
| P4.7 | Component | P4.2 | 20m | not_started |
| P4.8 | Component | - | 15m | not_started |
| P4.9 | Page | - | 30m | not_started |
| P4.10 | Component | P4.9 | 15m | not_started |
| P4.11 | API | - | 35m | not_started |

**Total:** 325 minutes ≈ **5.5 hours**

**With parallel execution:** ~3 hours (P4.1+P4.2+P4.3+P4.9+P4.11 in parallel, then components)
