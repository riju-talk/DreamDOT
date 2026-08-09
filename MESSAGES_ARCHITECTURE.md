# DreamDOT Messages Architecture - Hybrid DM + Community Chat

**Updated 2026-08-09**: this document originally described the intended design. Everything below is now built and wired end-to-end — real-time channel chat, browse/join/leave/delete, and persisted presence all shipped this pass. See `docs/DATA_SCHEMA.md` §2.4/§1.4 for the exact schema, and `docs/PRD.md` §6.4 for feature status.

## Overview
The Messages system combines Instagram-style DMs with Discord-style Community/Channel chats, creating a hybrid communication platform.

---

## System Architecture

### 1. **Two Communication Modes**

#### A. Direct Messages (DMs)
- **1-to-1 conversations** between users
- Simple, intimate messaging experience
- Quick access from user profiles
- Located in the "DMs" tab

#### B. Community Chats
- **Multi-user collaborative spaces** organized by project/topic
- Each community has multiple channels (like Discord)
- Channels are organized conversations within a community
- Members have roles: owner, admin, member
- Located in the "Communities" tab

---

## Database Schema

### PostgreSQL Community Database (structure only — see below for message content)
```
servers (communities)
├── server_id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT)
├── owner_id (UUID, FK to users)
├── is_public (BOOLEAN, default true) — backs Discover/join
├── created_at, updated_at

channels
├── channel_id (UUID, PK)
├── server_id (UUID, FK to servers)
├── name (VARCHAR)
├── type (text — no voice; enforced at the application level, not a DB enum)
├── topic (TEXT)
├── position (INT)

members
├── member_id (UUID, PK)
├── server_id (UUID, FK to servers)
├── user_id (UUID, FK to users)
├── role (owner|admin|member)
├── joined_at

presence
├── presence_id (UUID, PK)
├── user_id (UUID, UNIQUE, FK to users)
├── status (online|offline)
├── last_seen
```
There is no `messages` table in Postgres — it was defined but never used, and was removed. Channel message **content** lives in MongoDB instead (below), matching how DMs already worked.

### MongoDB — Message Content (DMs and Channels, one collection)
```
Message
├── conversationId (String) — DM/group, mutually exclusive with channelId
├── channelId (String)      — community channel, mutually exclusive with conversationId
├── senderId, content, type, attachments[], readBy[], timestamp
```
A `pre('validate')` hook enforces exactly one of `conversationId`/`channelId` per message. `apps/chat` (Express + Socket.IO) is the real-time transport for both: `message:send`/`message:new` for DMs, `channel:join`/`channel:leave`/`channel:message:send`/`channel:message:new` for channels — membership-gated via a Prisma client apps/chat holds against the same Postgres community tables (read-only for `servers`/`channels`/`members`, read-write for `presence`).

---

## UI Components

### Page Structure: `/messages`

```
┌─────────────────────────────────────────────────────┐
│              Sidebar          │ Main Chat │ Details │
├───────────────────────────────┼───────────┼─────────┤
│ Messages                      │           │         │
│ ┌─ Search...                  │           │         │
│ ├─ DMs | Communities (tabs)  │           │         │
│ │                             │           │         │
│ │ [DMs Tab]                   │  Messages │ Community
│ │ • Julian Voss               │  Area     │ Details:
│ │ • Elena Thorne              │           │ • Project
│ │ • Marcus Chen               │           │ • Members
│ │                             │           │ • Gallery
│ │ [Communities Tab]           │           │ • Progress
│ │ ▼ Ethereal Echoes           │           │
│ │   #general                  │           │
│ │   #assets                   │           │
│ │   #feedback                 │           │
│ │ • Product Design            │           │
│ │   #announcements             │           │
│ │   #design-review            │           │
│ └─────────────────────────────┘           └─────────┘
```

---

## API Endpoints (current, 2026-08-09)

### Messages
- `GET /api/messages/dms` - Fetch all DM conversations
- `GET/POST /api/conversations/[id]/messages` - DM message history (REST fallback; primary path is Socket.IO)

### Communities
- `GET /api/communities` - List user's communities
- `GET /api/communities/discover` - Browse public communities not yet joined
- `POST /api/communities` - Create new community
- `GET /api/communities/[communityId]` - Get community details
- `DELETE /api/communities/[communityId]` - Delete community (owner-only)
- `POST /api/communities/[communityId]/join` - Self-serve join (idempotent)
- `POST /api/communities/[communityId]/leave` - Self-serve leave (owner cannot leave — must delete instead)

### Channels
- `GET /api/communities/[communityId]/channels` - List channels
- `POST /api/communities/[communityId]/channels` - Create channel (owner/admin only)
- `GET/POST /api/communities/[communityId]/channels/[channelId]/messages` - Message history + REST fallback send (primary path is Socket.IO `channel:message:send`)

### Members & Presence
- `GET /api/communities/[communityId]/members` - List members
- `POST /api/communities/[communityId]/members` - Add member (owner/admin only)
- `DELETE /api/communities/[communityId]/members` - Remove member (owner/admin only — distinct from self-serve `/leave`)
- `GET /api/communities/[communityId]/presence` - Persisted online/offline snapshot

---

## Features Implemented

### ✅ Phase 1: Core UI & Architecture
- [x] Hybrid sidebar with DMs and Communities tabs
- [x] Search across conversations
- [x] Create community modal
- [x] Channel selection within communities
- [x] Community details panel (right sidebar)
- [x] Message input area
- [x] Full dark/light mode support

### ✅ Phase 2: Data Integration
- [x] Fetch user's DM list
- [x] Fetch user's communities
- [x] Display channels within communities
- [x] Create new communities with default #general channel
- [x] Track community membership and roles
- [x] Browse and join public communities not yet joined (Discover)
- [x] Self-serve leave; owner-only delete

### ✅ Phase 3: Real-Time Features (closed 2026-08-09)
- [x] WebSocket for real-time messages (DMs and channels — fixed a client/server field-name mismatch that meant DM sends were silently persisted with empty content, and an event-name mismatch that meant received messages never reached the client at all)
- [x] Typing indicators (pre-existing, DMs only — channels not wired to typing indicators yet)
- [ ] Read receipts (pre-existing gap, not touched this pass)
- [x] Online presence (persisted in Postgres, multi-tab-safe, hydrated on load + live via Socket.IO)
- [ ] Notifications (separate system — see `apps/notifications`, not integrated with chat events yet)

### 🔄 Phase 4: Advanced Features (Future)
- [ ] Message reactions
- [ ] Message editing/deletion
- [ ] Thread replies
- [ ] File sharing (attachment upload UI exists in `MessageInput`; server-side handling not audited this pass)
- [ ] Voice channels — explicitly out of scope for this product, not planned
- [ ] Screen sharing — explicitly out of scope for this product, not planned

---

## User Flows

### Creating a Community
1. User clicks **+** button in sidebar
2. Modal opens with form
3. User enters community name + description
4. System creates community with default #general channel
5. User is added as owner
6. Community appears in user's list
7. User can immediately chat in #general

### Joining a Community
1. User opens Discover (Communities page compass icon, or the Communities tab) and browses public communities they haven't joined
2. Clicks Join → `POST /api/communities/[id]/join`
3. Added to members with "member" role (idempotent — re-joining is a no-op, not an error)
4. Community appears in their list immediately

Invite links are not built — Discover is the only join path today.

### Sending a Message
1. User selects conversation (DM or channel)
2. Types message in input box
3. Clicks Send
4. Message appears in chat
5. Read receipts updated
6. Other participants notified

---

## Color Scheme & Branding
- **Primary**: #5a8c5a (light), primary CSS var (dark)
- **Secondary**: #99FF33 (accent green)
- **Typography**: Serif italic for headers, sans for body
- **Borders**: Subtle, use border-border CSS var
- **Backgrounds**: Use card, muted, background CSS vars

---

## Next Steps

1. **Implement real-time messaging** with WebSocket
2. **Add message persistence** to MongoDB
3. **Create community invite system**
4. **Add member management UI**
5. **Implement typing indicators**
6. **Add file upload support**
7. **Build voice channels** (Discord-style)

---

## Notes
- This is a **hybrid system** - it's NOT just DMs (Instagram) or just Communities (Discord)
- Users can have both intimate 1-on-1 conversations AND collaborative group spaces
- Communities are **project-focused** rather than topic-focused
- The design emphasizes **creator collaboration** fitting DreamDOT's mission
