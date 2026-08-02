'use client'

import React, { useMemo } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useChatStore } from '@/lib/store/useChatStore'
import { cn } from '@/lib/utils'

interface LivePresenceProps {
  conversationId: string
  participantIds: string[]
  participantNames: string[]
  maxDisplay?: number
}

/**
 * LivePresence Component
 * Displays online users, typing status, and real-time presence updates
 */
export function LivePresence({
  conversationId,
  participantIds,
  participantNames,
  maxDisplay = 5,
}: LivePresenceProps) {
  const { onlineUsers, typingUsers } = useChatStore((state) => ({
    onlineUsers: state.onlineUsers,
    typingUsers: state.typingUsers[conversationId] || [],
  }))

  // Map participants to their online status
  const participantStatus = useMemo(() => {
    return participantIds.map((id, idx) => ({
      id,
      name: participantNames[idx] || 'Unknown',
      isOnline: onlineUsers.includes(id),
      isTyping: typingUsers.includes(id),
    }))
  }, [participantIds, participantNames, onlineUsers, typingUsers])

  // Separate online and offline participants
  const onlineParticipants = participantStatus.filter((p) => p.isOnline)
  const typingParticipants = participantStatus.filter((p) => p.isTyping)

  // Display logic
  const displayedOnline = onlineParticipants.slice(0, maxDisplay)
  const hiddenOnlineCount = Math.max(0, onlineParticipants.length - maxDisplay)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Online users avatars */}
      <div className="flex items-center -space-x-2">
        {displayedOnline.map((participant) => (
          <TooltipProvider key={participant.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'relative w-8 h-8 rounded-full border-2 border-[#121412] flex items-center justify-center',
                    'bg-[#2a2826] text-xs font-semibold text-[#99FF33]',
                    'transition-all hover:scale-110 cursor-pointer'
                  )}
                >
                  {getInitials(participant.name)}

                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#99FF33] rounded-full border border-[#121412]" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#2a2826] text-[#FFFFFF] border-[#99FF33]">
                {participant.name}
                {participant.isTyping && ' (typing)'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {/* Show count of hidden online users */}
        {hiddenOnlineCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 rounded-full border-2 border-[#121412] flex items-center justify-center bg-[#2a2826] text-xs font-semibold text-[#99FF33]">
                  +{hiddenOnlineCount}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#2a2826] text-[#FFFFFF] border-[#99FF33]">
                {onlineParticipants
                  .slice(maxDisplay)
                  .map((p) => p.name)
                  .join(', ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Typing indicator */}
      {typingParticipants.length > 0 && (
        <div className="ml-2 flex items-center gap-1">
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-[#99FF33] rounded-full animate-bounce" />
            <span
              className="w-1.5 h-1.5 bg-[#99FF33] rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            />
            <span
              className="w-1.5 h-1.5 bg-[#99FF33] rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
          </div>
          <span className="text-xs text-[#99FF33]">
            {typingParticipants.length === 1
              ? `${typingParticipants[0].name} typing`
              : `${typingParticipants.length} typing`}
          </span>
        </div>
      )}
    </div>
  )
}
