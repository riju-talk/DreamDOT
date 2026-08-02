'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Hash, Users, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ChannelItemProps {
  channelId: string
  channelName: string
  memberCount?: number
  isSelected?: boolean
  onSelect?: (channelId: string) => void
  hasActivity?: boolean
  textOnly?: boolean
}

/**
 * ChannelItem Component
 * Displays a single channel in the channel list
 * Shows channel name with # prefix, member count, selected highlight, text-only badge
 */
export function ChannelItem({
  channelId,
  channelName,
  memberCount = 0,
  isSelected = false,
  onSelect,
  hasActivity = false,
  textOnly = true,
}: ChannelItemProps) {
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    onSelect?.(channelId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 rounded-lg',
        'hover:bg-[#1a1918]',
        isSelected && 'bg-[#1a1918] border-l-4 border-[#99FF33]',
        !isSelected && 'border-l-4 border-transparent'
      )}
      role="button"
      tabIndex={0}
      aria-label={`Channel ${channelName}`}
      aria-selected={isSelected}
    >
      {/* Channel icon */}
      <div className="flex-shrink-0 relative">
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
            isSelected ? 'bg-[#99FF33]' : 'bg-[#2a2826] group-hover:bg-[#99FF33]'
          )}
        >
          <Hash
            className={cn(
              'w-5 h-5 transition-colors',
              isSelected ? 'text-[#121412]' : 'text-[#99FF33]'
            )}
          />
        </div>

        {/* Activity indicator */}
        {hasActivity && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-[#99FF33] rounded-full animate-pulse" />
        )}
      </div>

      {/* Channel info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[#FFFFFF] truncate">{channelName}</h3>

          {/* Text-only badge (enforcement visible) */}
          {textOnly && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 bg-[#2a2826] rounded text-xs text-[#99FF33] border border-[#6B8E6E]">
                    <span className="text-xs font-semibold">TEXT</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#2a2826] text-[#FFFFFF] border-[#99FF33]">
                  Text-only channel (no voice/streaming)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Member count */}
        {memberCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-[#6B8E6E]">
            <Users className="w-3 h-3" />
            <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Hover indicator line */}
      {isHovering && !isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#99FF33]/30 rounded-l-lg" />
      )}
    </motion.div>
  )
}
