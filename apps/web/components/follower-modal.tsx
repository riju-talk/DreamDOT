'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'

interface Follower {
  id: string
  name: string
  avatar?: string
  bio?: string
  isFollowing?: boolean
}

interface FollowerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  type: 'followers' | 'following'
  title: string
}

export function FollowerModal({
  open,
  onOpenChange,
  userId,
  type,
  title,
}: FollowerModalProps) {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadFollowers()
    }
  }, [open, userId, type])

  const loadFollowers = async () => {
    try {
      setIsLoading(true)
      // Mock endpoint - would be /api/users/[userId]/followers or /api/users/[userId]/following
      const res = await fetch(`/api/users/${userId}/${type}`)
      if (res.ok) {
        const data = await res.json()
        const list = type === 'followers' ? data.followers : data.following
        setFollowers(list || [])
        setFilteredFollowers(list || [])
      }
    } catch (error) {
      console.error('[FollowerModal] Error loading followers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const filtered = followers.filter((follower) =>
      follower.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredFollowers(filtered)
  }, [searchQuery, followers])

  const handleFollowToggle = async (followerId: string, currentlyFollowing: boolean) => {
    try {
      const method = currentlyFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`/api/users/${followerId}/follow`, { method })

      if (res.ok) {
        setFollowers((prev) =>
          prev.map((f) =>
            f.id === followerId ? { ...f, isFollowing: !currentlyFollowing } : f
          )
        )
      }
    } catch (error) {
      console.error('[FollowerModal] Error toggling follow:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#121412] border-[#2a2826] text-[#FFFFFF]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B8E6E]" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a1918] border-[#2a2826] text-[#FFFFFF]"
            />
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#99FF33]" />
              </div>
            ) : filteredFollowers.length === 0 ? (
              <div className="text-center py-8 text-[#6B8E6E]">
                {followers.length === 0 ? 'No users yet' : 'No results found'}
              </div>
            ) : (
              filteredFollowers.map((follower) => (
                <div
                  key={follower.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1918] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{follower.name}</h4>
                    {follower.bio && (
                      <p className="text-xs text-[#6B8E6E] truncate">{follower.bio}</p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleFollowToggle(follower.id, follower.isFollowing || false)}
                    className={
                      follower.isFollowing
                        ? 'bg-[#2a2826] text-[#99FF33] border border-[#99FF33] text-xs'
                        : 'bg-[#99FF33] text-[#121412] text-xs'
                    }
                  >
                    {follower.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
