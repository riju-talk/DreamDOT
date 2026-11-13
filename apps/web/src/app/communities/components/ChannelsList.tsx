'use client'

import React, { useState, useEffect } from 'react'
import { ChannelItem } from './ChannelItem'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChannelsListProps {
  server: any
  selectedChannel?: any
  onSelectChannel?: (channel: any) => void
}

/**
 * ChannelsList Component
 * Displays channels in a community, supports channel selection and creation.
 * TEXT ONLY - enforces text-only channel display.
 */
export function ChannelsList({ server, selectedChannel, onSelectChannel }: ChannelsListProps) {
  const [channels, setChannels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const loadChannels = async () => {
    if (!server?.id) return
    try {
      setIsLoading(true)
      const response = await fetch(`/api/communities/${server.id}/channels`)
      if (!response.ok) throw new Error('Failed to load channels')
      const data = await response.json()
      setChannels(data.channels?.filter((ch: any) => ch.type === 'text') || [])
    } catch (error) {
      console.error('[ChannelsList] Error loading channels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadChannels()
    setShowCreateForm(false)
  }, [server?.id])

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim() || !server?.id) return

    try {
      setIsCreating(true)
      const response = await fetch(`/api/communities/${server.id}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName: newChannelName.trim() }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create channel')
      }
      const data = await response.json()
      setChannels((prev) => [...prev, data.channel])
      setNewChannelName('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('[ChannelsList] Error creating channel:', error)
    } finally {
      setIsCreating(false)
    }
  }

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
            aria-label={showCreateForm ? 'Cancel' : 'Create channel'}
            onClick={() => setShowCreateForm((v) => !v)}
          >
            {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateChannel} className="flex gap-1">
            <input
              autoFocus
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="new-channel"
              maxLength={100}
              className="flex-1 min-w-0 bg-[#1a1918] border border-[#2a2826] rounded px-2 py-1 text-sm text-[#FFFFFF] outline-none focus:ring-1 focus:ring-[#99FF33]"
            />
            <Button type="submit" size="sm" disabled={isCreating || !newChannelName.trim()} className="bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90">
              {isCreating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
            </Button>
          </form>
        )}
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
