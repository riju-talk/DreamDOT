'use client'

import React, { useState, useEffect } from 'react'
import { ChannelItem } from './ChannelItem'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChannelsListProps {
  server: any
  selectedChannel?: any
  onSelectChannel?: (channel: any) => void
}

/**
 * ChannelsList Component
 * Displays channels in a server, supports channel selection
 * TEXT ONLY - enforces text-only channel display
 */
export function ChannelsList({ server, selectedChannel, onSelectChannel }: ChannelsListProps) {
  const [channels, setChannels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load channels for server
  useEffect(() => {
    if (!server?.id) return

    const loadChannels = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/servers/${server.id}/channels`)
        if (!response.ok) throw new Error('Failed to load channels')
        const data = await response.json()
        // Filter to text-only channels
        setChannels(data.channels?.filter((ch: any) => ch.type === 'text') || [])
      } catch (error) {
        console.error('[ChannelsList] Error loading channels:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChannels()
  }, [server?.id])

  return (
    <div className="w-64 bg-[#0f0e0d] border-r border-[#2a2826] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#2a2826]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#FFFFFF] truncate">
            {server?.name || 'Channels'}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#6B8E6E] hover:text-[#99FF33]"
            aria-label="Create channel"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Channels List */}
      <div className={cn(
        'flex-1 overflow-y-auto space-y-1 p-2',
        isLoading && 'flex items-center justify-center'
      )}>
        {isLoading ? (
          <div className="text-center text-[#6B8E6E] text-sm">Loading channels...</div>
        ) : channels.length === 0 ? (
          <div className="text-center text-[#6B8E6E] text-sm py-8">
            <p>No text channels</p>
          </div>
        ) : (
          channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channelId={channel.id}
              channelName={channel.name}
              memberCount={channel.memberCount || 0}
              isSelected={selectedChannel?.id === channel.id}
              onSelect={() => onSelectChannel?.(channel)}
              hasActivity={channel.hasActivity}
              textOnly={true}
            />
          ))
        )}
      </div>
    </div>
  )
}
