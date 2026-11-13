'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Loader2, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateCommunityModal } from './CreateCommunityModal'

interface CommunitiesSidebarProps {
  selectedServer?: any
  onSelectServer?: (server: any) => void
  onSelectChannel?: (channel: any) => void
  discoverMode?: boolean
  onToggleDiscover?: () => void
  refreshKey?: number
}

/**
 * CommunitiesSidebar Component
 * Displays list of communities the current user has joined, plus entry points
 * to create a new community or browse/join public ones (Discover).
 */
export function CommunitiesSidebar({
  selectedServer,
  onSelectServer,
  onSelectChannel,
  discoverMode,
  onToggleDiscover,
  refreshKey,
}: CommunitiesSidebarProps) {
  const [servers, setServers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/communities')
        if (!response.ok) throw new Error('Failed to load communities')
        const data = await response.json()
        setServers(data.communities || [])
      } catch (error) {
        console.error('[CommunitiesSidebar] Error loading communities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCommunities()
  }, [refreshKey])

  const handleCreated = (community: any) => {
    setServers((prev) => [...prev, community])
    onSelectServer?.(community)
    if (community.channels?.length > 0) {
      onSelectChannel?.(community.channels[0])
    }
  }

  return (
    <div className="w-20 bg-[#0f0e0d] border-r border-[#2a2826] flex flex-col items-center gap-3 py-4">
      {/* New Community Button */}
      <Button
        className="h-12 w-12 rounded-full bg-[#99FF33] hover:bg-[#99FF33]/90 text-[#121412] font-bold"
        size="icon"
        aria-label="Create new community"
        onClick={() => setShowCreateModal(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Discover Button */}
      <button
        onClick={onToggleDiscover}
        aria-label="Discover communities"
        title="Discover communities"
        className={cn(
          'h-12 w-12 rounded-full flex items-center justify-center transition-all',
          discoverMode
            ? 'bg-[#99FF33] text-[#121412]'
            : 'bg-[#2a2826] text-[#99FF33] hover:bg-[#99FF33] hover:text-[#121412]'
        )}
      >
        <Compass className="h-5 w-5" />
      </button>

      {/* Divider */}
      <div className="w-8 h-0.5 bg-[#2a2826] rounded" />

      {/* Servers List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-[#99FF33] animate-spin" />
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center text-[#6B8E6E] text-xs py-4 px-1">No communities</div>
        ) : (
          servers.map((server) => (
            <button
              key={server.id}
              onClick={() => onSelectServer?.(server)}
              className={cn(
                'h-12 w-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                'hover:rounded-2xl duration-200',
                !discoverMode && selectedServer?.id === server.id
                  ? 'bg-[#99FF33] text-[#121412] rounded-2xl'
                  : 'bg-[#2a2826] text-[#99FF33] hover:bg-[#99FF33] hover:text-[#121412]'
              )}
              title={server.name}
              aria-label={`Community: ${server.name}`}
              aria-current={!discoverMode && selectedServer?.id === server.id}
            >
              {server.name?.charAt(0).toUpperCase() || 'S'}
            </button>
          ))
        )}
      </div>

      <CreateCommunityModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />
    </div>
  )
}
