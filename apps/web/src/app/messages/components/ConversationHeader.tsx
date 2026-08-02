'use client'

import { useState } from 'react'
import { useChatStore, selectActiveConversationTypingUsers, selectIsUserOnline } from '@/lib/store/useChatStore'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Search, MoreVertical, Info, Bell, BellOff, UserX, LogOut, ArrowLeft } from 'lucide-react'

// ============================================================================
// Type Definitions
// ============================================================================

export interface ConversationHeaderProps {
  conversationId: string
  onSearchClick?: () => void
  onInfoClick?: () => void
  onMuteToggle?: (isMuted: boolean) => void
  onBlockUser?: (userId: string) => void
  onLeaveConversation?: () => void
  onBackClick?: () => void
}

// ============================================================================
// ConversationHeader Component
// ============================================================================

export function ConversationHeader({
  conversationId,
  onSearchClick,
  onInfoClick,
  onMuteToggle,
  onBlockUser,
  onLeaveConversation,
  onBackClick,
}: ConversationHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Get from store
  const conversations = useChatStore((state) => state.conversations)
  const typingUsers = useChatStore(selectActiveConversationTypingUsers)

  // Find active conversation
  const conversation = conversations.find((conv) => conv.id === conversationId)

  console.log('[ConversationHeader] Rendering header for conversation:', conversationId)
  console.log('[ConversationHeader] Conversation found:', !!conversation)

  if (!conversation) {
    console.log('[ConversationHeader] No conversation found for ID:', conversationId)
    return (
      <div className="h-16 bg-[#121412] border-b border-[#2a2826] flex items-center px-6">
        <span className="text-[#6B8E6E]">No conversation selected</span>
      </div>
    )
  }

  // Determine title
  const title = conversation.name || conversation.participantNames.join(', ')

  // Get online status
  const onlineCount = conversation.participantIds.filter((id) =>
    useChatStore(selectIsUserOnline(id))(useChatStore.getState())
  ).length

  const isGroupChat = conversation.isGroup || conversation.participantIds.length > 2

  console.log('[ConversationHeader] Title:', title)
  console.log('[ConversationHeader] Online count:', onlineCount, '/ Total participants:', conversation.participantIds.length)
  console.log('[ConversationHeader] Is group chat:', isGroupChat)
  console.log('[ConversationHeader] Typing users:', typingUsers.length)

  // Helper to get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle menu actions
  const handleMuteToggle = () => {
    console.log('[ConversationHeader] Mute toggle clicked')
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    console.log('[ConversationHeader] Muted state changed to:', newMutedState)
    onMuteToggle?.(newMutedState)
    setMenuOpen(false)
  }

  const handleBlockUser = () => {
    console.log('[ConversationHeader] Block user clicked')
    if (conversation.participantIds[0]) {
      console.log('[ConversationHeader] Blocking user:', conversation.participantIds[0])
      onBlockUser?.(conversation.participantIds[0])
      setMenuOpen(false)
    }
  }

  const handleLeaveConversation = () => {
    console.log('[ConversationHeader] Leave conversation clicked')
    onLeaveConversation?.()
    setMenuOpen(false)
  }

  const setMenuOpen = (value: boolean) => {
    setIsMenuOpen(value)
  }

  return (
    <header className="h-16 bg-[#121412] border-b border-[#2a2826] flex items-center justify-between px-6 gap-4">
      {/* Left: Back Button (Mobile) + Title and Status */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Back Button - Mobile Only */}
        <div className="md:hidden flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-[#6B8E6E] hover:text-[#99FF33] hover:bg-[#2a2826] transition-colors"
                  onClick={() => {
                    console.log('[ConversationHeader] Back button clicked')
                    onBackClick?.()
                  }}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#2a2826] text-[#FFFFFF] border-[#99FF33]">
                Back to conversations
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Avatars */}
        <div className="flex-shrink-0">
          {isGroupChat ? (
            <div className="flex items-center">
              {conversation.participantNames.slice(0, 2).map((name, idx) => (
                <div
                  key={idx}
                  className={idx > 0 ? '-ml-2' : ''}
                >
                  <Avatar className="h-10 w-10 border-2 border-[#121412]">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                    <AvatarFallback className="bg-[#99FF33] text-[#121412] font-semibold">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ))}
              {conversation.participantNames.length > 2 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-1 h-10 w-10 rounded-full bg-[#2a2826] flex items-center justify-center text-xs font-semibold text-[#99FF33] border border-[#99FF33]">
                        +{conversation.participantNames.length - 2}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#2a2826] text-[#FFFFFF] border-[#99FF33]">
                      {conversation.participantNames.slice(2).join(', ')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.participantNames[0]}`}
              />
              <AvatarFallback className="bg-[#99FF33] text-[#121412] font-semibold">
                {getInitials(conversation.participantNames[0])}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Title and Status */}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-[#FFFFFF] truncate">{title}</h2>

          {/* Status and typing indicator */}
          <div className="text-xs text-[#6B8E6E] flex items-center gap-2">
            {typingUsers.length > 0 ? (
              <span className="flex items-center gap-1">
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 bg-[#99FF33] rounded-full animate-bounce" />
                  <span
                    className="w-1 h-1 bg-[#99FF33] rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <span
                    className="w-1 h-1 bg-[#99FF33] rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </span>
                typing...
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#99FF33] rounded-full" />
                  {onlineCount} online
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-[#6B8E6E] hover:text-[#99FF33] hover:bg-[#2a2826] transition-colors"
                onClick={() => {
                  console.log('[ConversationHeader] Search button clicked')
                  onSearchClick?.()
                }}
                aria-label="Search conversation"
              >
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#2a2826] text-[#FFFFFF] border-[#99FF33]">
              Search messages
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Menu Button */}
        <DropdownMenu open={isMenuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-[#6B8E6E] hover:text-[#99FF33] hover:bg-[#2a2826] transition-colors"
              aria-label="Conversation options menu"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#1a1918] border-[#2a2826] text-[#FFFFFF]"
          >
            {/* Info */}
            <DropdownMenuItem
              className="cursor-pointer hover:bg-[#2a2826] focus:bg-[#2a2826] text-[#FFFFFF]"
              onClick={() => {
                console.log('[ConversationHeader] Conversation info clicked')
                onInfoClick?.()
                setMenuOpen(false)
              }}
            >
              <Info className="mr-2 h-4 w-4 text-[#99FF33]" />
              <span>Conversation Info</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#2a2826]" />

            {/* Mute/Unmute */}
            <DropdownMenuItem
              className="cursor-pointer hover:bg-[#2a2826] focus:bg-[#2a2826] text-[#FFFFFF]"
              onClick={handleMuteToggle}
            >
              {isMuted ? (
                <>
                  <BellOff className="mr-2 h-4 w-4 text-[#99FF33]" />
                  <span>Unmute Conversation</span>
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4 text-[#99FF33]" />
                  <span>Mute Conversation</span>
                </>
              )}
            </DropdownMenuItem>

            {/* Block User (only for 1-on-1 conversations) */}
            {!isGroupChat && (
              <>
                <DropdownMenuSeparator className="bg-[#2a2826]" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-[#2a2826] focus:bg-[#2a2826] text-red-400"
                  onClick={handleBlockUser}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  <span>Block User</span>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-[#2a2826]" />

            {/* Leave */}
            <DropdownMenuItem
              className="cursor-pointer hover:bg-[#2a2826] focus:bg-[#2a2826] text-red-400"
              onClick={handleLeaveConversation}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isGroupChat ? 'Leave Group' : 'Delete Conversation'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
