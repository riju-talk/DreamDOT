'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Users, Search } from 'lucide-react'

interface DiscoverCommunity {
  id: string
  name: string
  description?: string
  memberCount: number
  createdAt: string
}

interface DiscoverCommunitiesProps {
  onJoined: (community: any) => void
}

/**
 * Browsable "communities you haven't joined yet" surface — the counterpart to
 * Discover/Marketplace's browse pattern, scoped to communities.
 */
export function DiscoverCommunities({ onJoined }: DiscoverCommunitiesProps) {
  const [communities, setCommunities] = useState<DiscoverCommunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [joiningId, setJoiningId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({ limit: '30' })
        if (query.trim()) params.set('q', query.trim())
        const res = await fetch(`/api/communities/discover?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled) setCommunities(data.communities || [])
        }
      } catch (error) {
        console.error('[DiscoverCommunities] Failed to load:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [query])

  const handleJoin = async (community: DiscoverCommunity) => {
    try {
      setJoiningId(community.id)
      const res = await fetch(`/api/communities/${community.id}/join`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to join')
      const data = await res.json()
      setCommunities((prev) => prev.filter((c) => c.id !== community.id))
      onJoined(data.member ? { id: community.id, name: community.name, description: community.description } : community)
    } catch (error) {
      console.error('[DiscoverCommunities] Failed to join:', error)
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#121412] p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#FFFFFF]">Discover Communities</h2>
          <p className="text-sm text-[#6B8E6E] mt-1">Browse and join public communities</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8E6E]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full bg-[#1a1918] border border-[#2a2826] rounded-full pl-10 pr-4 py-2 text-sm text-[#FFFFFF] outline-none focus:ring-2 focus:ring-[#99FF33]"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-[#99FF33] animate-spin" />
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-12 text-[#6B8E6E]">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No communities to discover right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {communities.map((community) => (
              <Card key={community.id} className="bg-[#1a1918] border-[#2a2826]">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#FFFFFF] truncate">{community.name}</p>
                    {community.description && (
                      <p className="text-xs text-[#6B8E6E] truncate mt-0.5">{community.description}</p>
                    )}
                    <p className="text-xs text-[#6B8E6E] mt-1">
                      {community.memberCount} {community.memberCount === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleJoin(community)}
                    disabled={joiningId === community.id}
                    className="bg-[#99FF33] text-[#121412] hover:bg-[#99FF33]/90 flex-shrink-0"
                  >
                    {joiningId === community.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Join'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
