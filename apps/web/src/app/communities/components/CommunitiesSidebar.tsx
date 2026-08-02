'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommunitiesSidebarProps {
  selectedServer?: any
  onSelectServer?: (server: any) => void
  onSelectChannel?: (channel: any) => void
}

/**
 * CommunitiesSidebar Component
 * Displays list of servers/communities
 */
export function CommunitiesSidebar({
  selectedServer,
  onSelectServer,
  onSelectChannel,
}: CommunitiesSidebarProps) {
  const [servers, setServers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load servers on mount
  useEffect(() => {
    const loadServers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/servers')
        if (!response.ok) throw new Error('Failed to load servers')
        const data = await response.json()
        setServers(data.servers || [])
      } catch (error) {
        console.error('[CommunitiesSidebar] Error loading servers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServers()
  }, [])

  return (
    <div className="w-20 bg-[#0f0e0d] border-r border-[#2a2826] flex flex-col items-center gap-3 py-4">
      {/* New Server Button */}
      <Button
        className="h-12 w-12 rounded-full bg-[#99FF33] hover:bg-[#99FF33]/90 text-[#121412] font-bold"
        size="icon"
        aria-label="Create new server"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Divider */}
      <div className="w-8 h-0.5 bg-[#2a2826] rounded" />

      {/* Servers List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-[#99FF33] animate-spin" />
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center text-[#6B8E6E] text-xs py-4">No servers</div>
        ) : (
          servers.map((server) => (
            <button
              key={server.id}
              onClick={() => onSelectServer?.(server)}
              className={cn(
                'h-12 w-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all',
                'hover:rounded-2xl duration-200',
                selectedServer?.id === server.id
                  ? 'bg-[#99FF33] text-[#121412] rounded-2xl'
                  : 'bg-[#2a2826] text-[#99FF33] hover:bg-[#99FF33] hover:text-[#121412]'
              )}
              title={server.name}
              aria-label={`Server: ${server.name}`}
              aria-current={selectedServer?.id === server.id}
            >
              {server.name?.charAt(0).toUpperCase() || 'S'}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
