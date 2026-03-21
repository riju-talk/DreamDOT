export interface ChatMessage {
    id: string
    content: string
    senderId: string
    senderName: string
    senderAvatar: string
    timestamp: string
    type: "text" | "image" | "file" | "audio" | "video"
    attachments?: Array<{ url: string; type: string; name?: string; size?: number }>
    fileUrl?: string
    fileName?: string
    isRead: boolean
    reactions?: MessageReaction[]
  }
  
  export interface MessageReaction {
    emoji: string
    userId: string
    userName: string
  }
  
  export interface ChatConversation {
    id: string
    type: "dm" | "group"
    name: string
    avatar?: string
    participants: ChatParticipant[]
    lastMessage?: ChatMessage
    unreadCount: number
    isOnline?: boolean
    lastSeen?: string
    createdAt: string
    updatedAt: string
  }
  
  export interface ChatParticipant {
    id: string
    name: string
    handle: string
    avatar: string
    role?: "admin" | "member"
    isOnline: boolean
    lastSeen?: string
  }
  
  export interface GroupChat extends ChatConversation {
    type: "group"
    description?: string
    isPrivate: boolean
    adminIds: string[]
    memberCount: number
  }
  
  export interface DirectMessage extends ChatConversation {
    type: "dm"
    otherParticipant: ChatParticipant
  }