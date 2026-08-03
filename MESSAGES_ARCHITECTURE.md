# DreamDOT Messages Architecture - Hybrid DM + Community Chat

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

### PostgreSQL Community Database
```
servers (communities)
├── server_id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT)
├── owner_id (UUID, FK to users)
├── created_at, updated_at

channels
├── channel_id (UUID, PK)
├── server_id (UUID, FK to servers)
├── name (VARCHAR)
├── type (text|voice)
├── topic (TEXT)
├── position (INT)

members
├── member_id (UUID, PK)
├── server_id (UUID, FK to servers)
├── user_id (UUID, FK to users)
├── role (owner|admin|member)
├── joined_at

messages
├── message_id (UUID, PK)
├── channel_id (UUID, FK to channels)
├── user_id (UUID, FK to users)
├── content (TEXT)
├── created_at, updated_at

presence
├── presence_id (UUID, PK)
├── user_id (UUID, FK to users)
├── status (online|away|offline)
├── last_seen
```

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

## API Endpoints

### Messages
- `GET /api/messages/dms` - Fetch all DM conversations
- `GET /api/messages/dms/[userId]` - Fetch specific DM
- `POST /api/messages/dms/[userId]` - Send DM message

### Communities
- `GET /api/communities` - List user's communities
- `POST /api/communities` - Create new community
- `GET /api/communities/[communityId]` - Get community details
- `POST /api/communities/[communityId]` - Create channel

### Channel Messages
- `GET /api/communities/[communityId]/channels/[channelId]` - Fetch messages
- `POST /api/communities/[communityId]/channels/[channelId]` - Send message

### Members
- `GET /api/communities/[communityId]/members` - List members
- `POST /api/communities/[communityId]/members` - Add member
- `DELETE /api/communities/[communityId]/members/[userId]` - Remove member

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

### 🔄 Phase 3: Real-Time Features (Future)
- [ ] WebSocket for real-time messages
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Online presence
- [ ] Notifications

### 🔄 Phase 4: Advanced Features (Future)
- [ ] Message reactions
- [ ] Message editing/deletion
- [ ] Thread replies
- [ ] File sharing
- [ ] Voice channels
- [ ] Screen sharing

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
1. User receives invite link
2. Click link → Joins community
3. Added to members with "member" role
4. Community appears in their list

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
