'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { File, Download, Loader2, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useChatStore, selectActiveConversationMessages, selectActiveConversationTypingUsers } from '@/lib/store/useChatStore'
import { Button } from '@/components/ui/button'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Message {
  id: string
  conversationId: string
  userId: string
  userName: string
  text: string
  attachment?: { url: string; type: string; name?: string }
  createdAt: Date | string
  readBy: string[]
  isOptimistic?: boolean
  userAvatar?: string
}

export interface MessageListProps {
  conversationId?: string
  onLoadMore?: () => void
  hasMoreMessages?: boolean
  isLoadingMore?: boolean
}

// Virtual scrolling constants
const MESSAGE_ITEM_HEIGHT = 80
const VIRTUAL_BUFFER_SIZE = 5

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if two dates are the same calendar day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Format message date for display
 */
function formatMessageDate(date: Date): string {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (isSameDay(date, now)) {
    return 'Today'
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
}

/**
 * Format time for message timestamp
 */
function formatMessageTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format relative time (e.g., "2m ago", "1h ago")
 */
function formatRelativeTime(date: Date | string): string {
  const messageDate = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - messageDate.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatMessageDate(messageDate)
}

// ============================================================================
// Message Grouping Utilities
// ============================================================================

interface DateGroup {
  date: string
  messages: Message[]
}

/**
 * Group messages by calendar day
 */
function groupMessagesByDate(messages: Message[]): DateGroup[] {
  console.log('[MessageList] Grouping', messages.length, 'messages by date')
  const groups: DateGroup[] = []
  let currentGroup: DateGroup | null = null

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt)
    const dateString = formatMessageDate(messageDate)

    if (!currentGroup || currentGroup.date !== dateString) {
      currentGroup = {
        date: dateString,
        messages: [],
      }
      groups.push(currentGroup)
    }

    currentGroup.messages.push(message)
  })

  console.log('[MessageList] Created', groups.length, 'date groups')
  return groups
}

/**
 * Flatten grouped messages into a render list
 */
function flattenGroupedMessages(groupedMessages: DateGroup[]): Array<{ type: 'date' | 'message'; date?: string; data?: Message }> {
  const items: Array<{ type: 'date' | 'message'; date?: string; data?: Message }> = []

  groupedMessages.forEach((group) => {
    items.push({ type: 'date', date: group.date })
    group.messages.forEach((msg) => {
      items.push({ type: 'message', data: msg })
    })
  })

  console.log('[MessageList] Flattened into', items.length, 'items for rendering')
  return items
}

// ============================================================================
// Component: Read Receipt
// ============================================================================

/**
 * Display read receipt checkmark(s)
 */
function ReadReceipt({ readBy, totalParticipants }: { readBy: string[]; totalParticipants: number }) {
  const isFullyRead = readBy.length === totalParticipants

  console.log('[ReadReceipt] Displaying receipt:', { isFullyRead, readCount: readBy.length, total: totalParticipants })

  return (
    <span className="text-xs text-[#6B8E6E] ml-1 font-semibold">
      {isFullyRead ? '✓✓' : '✓'}
    </span>
  )
}

// ============================================================================
// Component: Attachment Preview
// ============================================================================

/**
 * Display attachment preview (image or file)
 */
function AttachmentPreview({ attachment }: { attachment?: { url: string; type: string; name?: string } }) {
  if (!attachment) return null

  const type = attachment.type || ''

  // Image preview
  if (type.startsWith('image/')) {
    console.log('[MessageList] Rendering image attachment:', attachment.url)
    return (
      <div className="mt-2 rounded-md overflow-hidden max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attachment.url}
          alt="attachment"
          className="max-h-60 w-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
          loading="lazy"
        />
      </div>
    )
  }

  // File attachment with download link
  console.log('[MessageList] Rendering file attachment:', attachment.name || 'unknown file')
  return (
    <a
      href={attachment.url}
      download
      className="mt-2 flex items-center gap-2 p-2 rounded-md bg-[#2a2826] hover:bg-[#3a3a36] transition-colors text-sm text-[#99FF33]"
      target="_blank"
      rel="noopener noreferrer"
    >
      <File className="h-4 w-4 flex-shrink-0" />
      <span className="truncate flex-1">{attachment.name || 'Download file'}</span>
      <Download className="h-4 w-4 flex-shrink-0" />
    </a>
  )
}

// ============================================================================
// Component: Date Separator
// ============================================================================

/**
 * Display date separator between message groups
 */
function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-3 py-4 px-2">
      <div className="flex-1 h-px bg-[#2a2826]" />
      <span className="text-xs text-[#6B8E6E] px-2 font-medium">{date}</span>
      <div className="flex-1 h-px bg-[#2a2826]" />
    </div>
  )
}

// ============================================================================
// Component: Typing Indicator
// ============================================================================

/**
 * Display typing indicator for users typing
 */
function TypingIndicator({ userNames }: { userNames: string[] }) {
  if (userNames.length === 0) return null

  console.log('[MessageList] Showing typing indicator for:', userNames)

  const displayText = userNames.length === 1 ? `${userNames[0]} is typing...` : `${userNames.length} people typing...`

  return (
    <div className="flex gap-2 mb-2 animate-pulse">
      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
        <AvatarFallback className="bg-[#99FF33] text-[#121412] text-xs">T</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="text-xs text-[#99FF33] font-medium px-3">{displayText}</p>
        <Card className="bg-[#2a2826] border-[#2a2826] border-0 max-w-xs">
          <CardContent className="p-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#99FF33] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#99FF33] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-2 h-2 bg-[#99FF33] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================================
// Component: Individual Message
// ============================================================================

/**
 * Render a single message
 */
function MessageComponent({
  message,
  isCurrentUser,
  showAvatar,
  showName,
  totalParticipants,
}: {
  message: Message
  isCurrentUser: boolean
  showAvatar: boolean
  showName: boolean
  totalParticipants: number
}) {
  const [showTimestamp, setShowTimestamp] = useState(false)

  console.log('[MessageComponent] Rendering message:', {
    id: message.id,
    from: message.userName,
    isCurrentUser,
    hasAttachment: !!message.attachment,
  })

  return (
    <div
      className={`flex gap-2 mb-2 group ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
    >
      {/* Avatar for other users */}
      {!isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarImage src={message.userAvatar || `/placeholder.svg`} alt={message.userName} />
          <AvatarFallback className="bg-[#99FF33] text-[#121412] text-xs font-semibold">
            {message.userName?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message bubble and metadata */}
      <div className={`${isCurrentUser ? '' : showAvatar ? '' : 'ml-10'} flex flex-col gap-1`}>
        {/* Sender name (for group chats, other users) */}
        {showName && !isCurrentUser && <p className="text-xs text-[#6B8E6E] font-medium px-3">{message.userName}</p>}

        {/* Message bubble */}
        <Card
          className={`${
            isCurrentUser
              ? 'bg-[#99FF33] text-[#121412] border-[#99FF33]'
              : 'bg-[#2a2826] text-[#FFFFFF] border-[#2a2826]'
          } border-0 max-w-xs`}
        >
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>

            {message.attachment && <AttachmentPreview attachment={message.attachment} />}
          </CardContent>
        </Card>

        {/* Timestamp and read receipt */}
        <div
          className={`flex items-center gap-1 px-3 text-xs text-[#6B8E6E] ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}
        >
          {showTimestamp && <span>{formatMessageTime(message.createdAt)}</span>}
          {isCurrentUser && message.readBy && <ReadReceipt readBy={message.readBy} totalParticipants={totalParticipants} />}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main MessageList Component
// ============================================================================

export function MessageList({
  conversationId,
  onLoadMore,
  hasMoreMessages = false,
  isLoadingMore = false,
}: MessageListProps) {
  console.log('[MessageList] Rendering:', { conversationId, hasMoreMessages, isLoadingMore })

  const { data: session } = useSession()
  const currentUserId = (session as any)?.user?.id

  // Get messages and typing users from store
  const messages = useChatStore(selectActiveConversationMessages)
  const typingUserIds = useChatStore(selectActiveConversationTypingUsers)
  const isLoadingChat = useChatStore((state) => state.isLoading)
  const conversations = useChatStore((state) => state.conversations)
  const activeConversationId = useChatStore((state) => state.activeConversationId)

  // Find active conversation to get participant count for read receipts
  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const totalParticipants = activeConversation?.participantIds.length || 1

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State
  const [autoScroll, setAutoScroll] = useState(true)

  // Group and flatten messages
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(messages)
  }, [messages])

  const flattenedItems = useMemo(() => {
    return flattenGroupedMessages(groupedMessages)
  }, [groupedMessages])

  // Get typing user names
  const typingUserNames = useMemo(() => {
    if (typingUserIds.length === 0) return []
    return typingUserIds.slice(0, 2) // Show max 2 typing users
  }, [typingUserIds])

  // Auto-scroll to latest message when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      console.log('[MessageList] Auto-scrolling to bottom')
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, autoScroll])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMoreMessages && !isLoadingMore && onLoadMore) {
            console.log('[MessageList] Loading more messages - triggered by scroll to top')
            onLoadMore()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasMoreMessages, isLoadingMore, onLoadMore])

  // Handle scroll to manage auto-scroll state
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight

    // Auto-scroll if within 100px of bottom
    const shouldAutoScroll = distanceFromBottom < 100
    if (shouldAutoScroll !== autoScroll) {
      console.log('[MessageList] Auto-scroll state changed to:', shouldAutoScroll)
      setAutoScroll(shouldAutoScroll)
    }
  }, [autoScroll])

  // Empty state - loading
  if (messages.length === 0 && isLoadingChat) {
    console.log('[MessageList] Showing loading state')
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121412]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#99FF33]" />
          <p className="text-sm text-[#6B8E6E]">Loading messages...</p>
        </div>
      </div>
    )
  }

  // Empty state - no messages
  if (messages.length === 0) {
    console.log('[MessageList] Showing empty state')
    return (
      <div className="flex-1 flex items-center justify-center bg-[#121412]">
        <div className="text-center space-y-2">
          <p className="text-sm text-[#6B8E6E]">No messages yet</p>
          <p className="text-xs text-[#6B8E6E]">Start the conversation</p>
        </div>
      </div>
    )
  }

  console.log('[MessageList] Rendering', messages.length, 'messages with', typingUserNames.length, 'typing indicators')

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-[#121412] scrollbar-thin scrollbar-thumb-[#2a2826] scrollbar-track-transparent hover:scrollbar-thumb-[#3a3a36]" onScroll={handleScroll}>
      <div className="px-4 py-4 space-y-2">
        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-2" />

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-[#99FF33]" />
            <span className="ml-2 text-xs text-[#6B8E6E]">Loading older messages...</span>
          </div>
        )}

        {/* Render all messages and separators */}
        {flattenedItems.map((item, index) => {
          if (item.type === 'date') {
            return <DateSeparator key={`date-${item.date}`} date={item.date!} />
          }

          const message = item.data!
          const isCurrentUser = message.userId === currentUserId

          // Determine if we should show avatar and name by looking at adjacent messages
          const nextItem = flattenedItems[index + 1]
          const prevItem = flattenedItems[index - 1]

          const nextIsSameUser = nextItem?.type === 'message' && nextItem.data!.userId === message.userId
          const prevIsSameUser = prevItem?.type === 'message' && prevItem.data!.userId === message.userId

          const showAvatar = !nextIsSameUser
          const showName = prevItem?.type === 'date' || !prevIsSameUser

          return (
            <MessageComponent
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              showAvatar={showAvatar}
              showName={showName}
              totalParticipants={totalParticipants}
            />
          )
        })}

        {/* Typing indicator */}
        {typingUserNames.length > 0 && <TypingIndicator userNames={typingUserNames} />}

        {/* Auto-scroll to bottom button */}
        {!autoScroll && messages.length > 0 && (
          <div className="sticky bottom-4 flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('[MessageList] User clicked scroll to bottom')
                setAutoScroll(true)
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-full gap-2 bg-[#99FF33] text-[#121412] hover:bg-[#7FCC1F] border-0"
            >
              <ChevronDown className="h-4 w-4" />
              New messages
            </Button>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageList
