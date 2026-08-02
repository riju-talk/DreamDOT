'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn, formatRelativeTime } from '@/lib/utils'
import { useChatStore } from '@/lib/store/useChatStore'
import Image from 'next/image'
import { useState } from 'react'

interface Conversation {
  id: string
  participantIds: string[]
  participantNames: string[]
  name?: string
  isGroup: boolean
  lastMessage?: {
    id: string
    conversationId: string
    userId: string
    userName: string
    text: string
    attachment?: { url: string; type: string }
    createdAt: Date
    readBy: string[]
    isOptimistic?: boolean
  }
  unreadCount: number
  createdAt: Date
}

interface ConversationItemProps {
  conversation: Conversation
  onSelect: (conversationId: string) => void
}

/**
 * ConversationItem Component
 * Displays a single conversation in the conversations list
 * Shows participant info, last message preview, unread badge, and online status
 */
export function ConversationItem({ conversation, onSelect }: ConversationItemProps) {
  const [isHovering, setIsHovering] = useState(false)
  const { activeConversationId, selectConversationUnreadCount, unreadCounts, typingUsers, onlineUsers } = useChatStore(
    (state) => ({
      activeConversationId: state.activeConversationId,
      selectConversationUnreadCount: (id: string) => state.unreadCounts[id] || 0,
      unreadCounts: state.unreadCounts,
      typingUsers: state.typingUsers,
      onlineUsers: state.onlineUsers,
    })
  )

  const isActive = activeConversationId === conversation.id
  const unreadCount = unreadCounts[conversation.id] || 0
  const typingUsersList = typingUsers[conversation.id] || []
  const conversationTitle = conversation.name || conversation.participantNames.join(', ')
  
  // Truncate last message to 50 characters
  const lastMessageText = conversation.lastMessage?.text || ''
  const truncatedMessage = lastMessageText.length > 50 ? lastMessageText.substring(0, 50) + '...' : lastMessageText

  // Get online status for first participant (or check if any participant is online in group)
  const participantOnlineStatus = conversation.isGroup
    ? conversation.participantIds.some((id) => onlineUsers.includes(id))
    : onlineUsers.includes(conversation.participantIds[0])

  const isTyping = typingUsersList.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'relative flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 rounded-lg',
        'hover:bg-[#1a1918]',
        isActive && 'bg-[#1a1918] border-l-4 border-[#99FF33]',
        !isActive && 'border-l-4 border-transparent'
      )}
      role="button"
      tabIndex={0}
      aria-label={`Conversation with ${conversationTitle}`}
      aria-selected={isActive}
    >
      {/* Avatar Section */}
      <div className="relative flex-shrink-0">
        {conversation.isGroup ? (
          // Group avatar placeholder
          <div className="w-10 h-10 rounded-full bg-[#2a2826] flex items-center justify-center border border-[#6B8E6E]">
            <span className="text-xs text-[#99FF33] font-semibold">
              {conversation.participantNames.length}
            </span>
          </div>
        ) : (
          // Single participant avatar
          <div className="w-10 h-10 rounded-full bg-[#2a2826] flex items-center justify-center border border-[#6B8E6E] overflow-hidden">
            <span className="text-xs text-[#99FF33] font-semibold">
              {conversation.participantNames[0]?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}

        {/* Online Status Indicator */}
        <div
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#121412]',
            participantOnlineStatus ? 'bg-[#99FF33]' : 'bg-[#6B8E6E]'
          )}
          title={participantOnlineStatus ? 'Online' : 'Offline'}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        {/* Title and Timestamp */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#FFFFFF] truncate">{conversationTitle}</h3>
          {conversation.lastMessage && (
            <span className="text-xs text-[#6B8E6E] flex-shrink-0">
              {formatRelativeTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>

        {/* Message Preview or Typing Indicator */}
        <p
          className={cn(
            'text-xs truncate',
            isTyping ? 'text-[#99FF33] italic' : 'text-[#6B8E6E]'
          )}
        >
          {isTyping ? (
            <span>
              {typingUsersList.length === 1
                ? `${typingUsersList[0]} is typing...`
                : `${typingUsersList.length} people typing...`}
            </span>
          ) : (
            <>
              {conversation.lastMessage && (
                <>
                  <span className="font-semibold">{conversation.lastMessage.userName}:</span> {truncatedMessage}
                </>
              )}
              {!conversation.lastMessage && <span className="italic text-[#6B8E6E]">No messages yet</span>}
            </>
          )}
        </p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <Badge
          className="flex-shrink-0 bg-[#99FF33] text-[#121412] font-bold border-0 h-6 w-6 flex items-center justify-center rounded-full p-0"
          variant="default"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}

      {/* Hover indicator line (subtle) */}
      {isHovering && !isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#99FF33]/30 rounded-l-lg" />
      )}
    </motion.div>
  )
}
