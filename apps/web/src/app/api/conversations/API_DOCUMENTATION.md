# Chat API Endpoints Documentation

## Overview
This document describes all chat-related API endpoints for the DreamDot application. All endpoints require authentication and return JSON responses.

---

## Endpoints

### 1. GET /api/conversations
Fetch user's conversations with pagination and unread counts.

**Authentication:** Required (session-based via next-auth)

**Query Parameters:**
- `limit` (optional, default: 20, max: 100) - Number of conversations to return
- `offset` (optional, default: 0) - Number of conversations to skip for pagination

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "conv-123",
      "type": "direct|group",
      "name": "Conversation Name",
      "avatar": "avatar-url",
      "participants": [
        {
          "id": "user-1",
          "name": "User Name",
          "avatar": "avatar-url"
        }
      ],
      "lastMessage": {
        "id": "msg-456",
        "content": "Last message content",
        "senderId": "user-1",
        "senderName": "User Name",
        "senderAvatar": "avatar-url",
        "timestamp": "2024-01-15T10:30:00Z",
        "type": "text"
      },
      "unreadCount": 5,
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 42
  }
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Database error

**Logging:**
- `[API] GET /api/conversations - userId: {userId}`
- `[API] GET /api/conversations - returned {count} conversations`

---

### 2. POST /api/conversations
Create a new conversation (direct or group).

**Authentication:** Required

**Request Body:**
```json
{
  "type": "direct|group",
  "participants": ["user-id-1", "user-id-2"],
  "name": "Conversation Name (optional for direct)",
  "avatar": "avatar-url (optional)"
}
```

**Validation:**
- `type` must be "direct" or "group"
- `participants` must be a non-empty array
- At least one participant required

**Response (201):**
```json
{
  "conversation": {
    "id": "conv-123",
    "type": "direct|group",
    "name": "Conversation Name",
    "avatar": "avatar-url",
    "participants": [
      {
        "id": "user-123",
        "name": "User Name",
        "avatar": "avatar-url"
      }
    ],
    "lastMessage": null,
    "unreadCount": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields or invalid type
- `401 Unauthorized` - User not authenticated
- `500 Internal Server Error` - Database error

**Logging:**
- `[API] POST /api/conversations - type: {type}, userId: {userId}`
- `[API] POST /api/conversations - created conversation {id}`

---

### 3. GET /api/conversations/[id]/messages
Fetch messages for a specific conversation with pagination.

**Authentication:** Required

**Path Parameters:**
- `id` (required) - Conversation ID

**Query Parameters:**
- `limit` (optional, default: 20, max: 100) - Number of messages to return
- `offset` (optional, default: 0) - Number of messages to skip

**Response (200):**
```json
{
  "messages": [
    {
      "id": "msg-123",
      "conversationId": "conv-456",
      "content": "Message content",
      "senderId": "user-789",
      "senderName": "Sender Name",
      "senderAvatar": "avatar-url",
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "text|image|file|audio|video",
      "attachments": [
        {
          "url": "attachment-url",
          "type": "image|file|audio|video",
          "name": "filename.ext",
          "size": 1024
        }
      ],
      "readBy": ["user-1", "user-2"],
      "isRead": true,
      "editedAt": null
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 156
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing conversation ID
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User not participant in conversation
- `404 Not Found` - Conversation not found
- `500 Internal Server Error` - Database error

**Logging:**
- `[API] GET /api/conversations/[id]/messages - conversationId: {id}, userId: {userId}`
- `[API] GET /api/conversations/[id]/messages - returned {count} messages`

---

### 4. POST /api/conversations/[id]/messages
Send a message to a conversation.

**Authentication:** Required

**Path Parameters:**
- `id` (required) - Conversation ID

**Request Body:**
```json
{
  "content": "Message content",
  "type": "text|image|file|audio|video (optional, default: text)",
  "attachments": [
    {
      "url": "attachment-url",
      "type": "image|file|audio|video",
      "name": "filename.ext",
      "size": 1024
    }
  ]
}
```

**Validation:**
- `content` must be a non-empty string (max 4000 characters)
- `type` must be one of: text, image, file, audio, video, system
- `attachments` (if provided) must be an array

**Response (201):**
```json
{
  "message": {
    "id": "msg-123",
    "conversationId": "conv-456",
    "content": "Message content",
    "senderId": "user-789",
    "senderName": "Sender Name",
    "senderAvatar": "avatar-url",
    "timestamp": "2024-01-15T10:30:00Z",
    "type": "text",
    "attachments": [],
    "readBy": ["user-789"],
    "isRead": true,
    "editedAt": null
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid content, empty message, or content too long
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User not participant in conversation
- `404 Not Found` - Conversation not found
- `500 Internal Server Error` - Database error

**Logging:**
- `[API] POST /api/conversations/[id]/messages - conversationId: {id}, userId: {userId}`
- `[API] POST /api/conversations/[id]/messages - created message {id}`

---

### 5. POST /api/messages
Standalone endpoint for creating messages (alternative to route #4).

**Authentication:** Required

**Request Body:**
```json
{
  "conversationId": "conv-123",
  "content": "Message content",
  "type": "text|image|file|audio|video (optional, default: text)",
  "attachments": [
    {
      "url": "attachment-url",
      "type": "image|file|audio|video",
      "name": "filename.ext",
      "size": 1024
    }
  ]
}
```

**Validation:**
- `conversationId` must be provided and must be a string
- `content` must be a non-empty string (max 4000 characters)
- `type` must be one of: text, image, file, audio, video, system
- `attachments` (if provided) must be an array

**Response (201):**
```json
{
  "message": {
    "id": "msg-123",
    "conversationId": "conv-456",
    "content": "Message content",
    "senderId": "user-789",
    "senderName": "Sender Name",
    "senderAvatar": "avatar-url",
    "timestamp": "2024-01-15T10:30:00Z",
    "type": "text",
    "attachments": [],
    "readBy": ["user-789"],
    "isRead": true,
    "editedAt": null
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (missing conversationId, empty content, content too long, invalid attachments)
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - User not participant in conversation
- `404 Not Found` - Conversation not found
- `500 Internal Server Error` - Database error

**Logging:**
- `[API] POST /api/messages - conversationId: {id}, userId: {userId}`
- `[API] POST /api/messages - created message {id}`

---

## Authentication

All endpoints use **next-auth** for session-based authentication. The session must contain:
```
session.user.id (user ID)
```

If authentication fails, all endpoints return `401 Unauthorized`.

---

## Pagination

All endpoints supporting pagination use:
- `limit` - Number of items per page (default: 20, max: 100)
- `offset` - Number of items to skip (default: 0)

Results are always sorted by most recent first (for conversations and messages by `lastMessageAt` and `timestamp` respectively).

---

## Error Handling

All endpoints implement comprehensive error handling:

1. **400 Bad Request** - Invalid input validation (missing fields, wrong types, constraints)
2. **401 Unauthorized** - Authentication required or invalid session
3. **403 Forbidden** - User lacks permission (not conversation participant)
4. **404 Not Found** - Resource not found
5. **500 Internal Server Error** - Database or server error

All errors return JSON with an `error` field describing the issue.

---

## Logging

All endpoints include comprehensive console logging with `[API]` prefix:

- Request start: `[API] {METHOD} {ENDPOINT} - userId: {userId}, params...`
- Request success: `[API] {METHOD} {ENDPOINT} - {result description}`
- Request errors: `[API] Error {description}` (with error object in console.error)

---

## Database Models

### Conversation
- `_id` - ObjectId
- `type` - String (direct | group)
- `participants` - Array of user IDs
- `admins` - Array of admin user IDs
- `name` - String (optional)
- `description` - String (optional)
- `avatar` - String URL (optional)
- `lastMessage` - Reference to Message ObjectId
- `lastMessageAt` - Date
- `unreadBy` - Array of user IDs with unread messages
- `createdBy` - User ID
- `isArchived` - Boolean
- `timestamps` - createdAt, updatedAt

**Indexes:**
- `participants`
- `lastMessageAt` (descending)
- `type + participants`

### Message
- `_id` - ObjectId
- `conversationId` - String (indexed)
- `senderId` - String (indexed)
- `content` - String (max 4000 chars)
- `type` - String (text | image | file | audio | video | system)
- `attachments` - Array of attachment objects
- `readBy` - Array of user IDs (indexed)
- `editedAt` - Date (optional)
- `isDeleted` - Boolean
- `replyTo` - String (optional, message ID)
- `timestamp` - Date (indexed)
- `timestamps` - createdAt, updatedAt

**Indexes:**
- `conversationId + timestamp` (descending)
- `senderId + timestamp` (descending)
- `readBy`

---

## File Attachments

Attachments should have the following structure:
```json
{
  "url": "https://storage-service/path/to/file",
  "type": "image|file|audio|video",
  "name": "filename.ext",
  "size": 1024
}
```

The `url` field should be a full URL to the file (typically from a cloud storage service like Cloudinary or ImageKit).

---

## Response Headers

All endpoints return:
- `Content-Type: application/json`
- Standard HTTP status codes

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting middleware for production deployments.

---

## Examples

### Create a direct conversation
```bash
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "type": "direct",
    "participants": ["user-456"]
  }'
```

### Fetch conversations
```bash
curl http://localhost:3000/api/conversations?limit=10&offset=0
```

### Send a message
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv-123",
    "content": "Hello there!",
    "type": "text"
  }'
```

### Fetch messages with pagination
```bash
curl http://localhost:3000/api/conversations/conv-123/messages?limit=50&offset=0
```

---

## Version
- **API Version:** 1.0
- **Last Updated:** 2024-01-15
- **Status:** Production Ready
