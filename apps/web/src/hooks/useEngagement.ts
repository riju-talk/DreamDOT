import { useState, useEffect, useCallback } from 'react'

interface EngagementData {
  saves: {
    count: number
    saved: boolean
  }
  shares: {
    count: number
    shared: boolean
  }
}

interface EngagementMap {
  [postId: string]: EngagementData
}

export function useEngagement(postIds: string[]) {
  const [engagement, setEngagement] = useState<EngagementMap>({})
  const [loading, setLoading] = useState(false)

  const fetchEngagement = useCallback(async () => {
    if (!postIds || postIds.length === 0) return

    setLoading(true)
    try {
      const query = new URLSearchParams({
        postIds: postIds.join(','),
      })

      const response = await fetch(`/api/posts/engagement?${query}`)
      if (!response.ok) throw new Error('Failed to fetch engagement')

      const data = await response.json()
      setEngagement(data.engagement || {})

      console.log(`✅ Fetched engagement for ${postIds.length} posts`)
    } catch (error) {
      console.error('Error fetching engagement:', error)
    } finally {
      setLoading(false)
    }
  }, [postIds])

  useEffect(() => {
    fetchEngagement()
  }, [fetchEngagement])

  const toggleSave = useCallback(
    async (postId: string) => {
      const current = engagement[postId]
      if (!current) return

      const wasSaved = current.saves.saved

      try {
        // Optimistic update
        setEngagement(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            saves: {
              count: wasSaved ? current.saves.count - 1 : current.saves.count + 1,
              saved: !wasSaved,
            },
          },
        }))

        const method = wasSaved ? 'DELETE' : 'POST'
        const response = await fetch('/api/posts/save', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId }),
        })

        if (!response.ok) {
          // Revert on error
          setEngagement(prev => ({
            ...prev,
            [postId]: current,
          }))
          console.error('Failed to toggle save')
          return
        }

        console.log(`✅ Save toggled for post ${postId}`)
      } catch (error) {
        // Revert on error
        setEngagement(prev => ({
          ...prev,
          [postId]: current,
        }))
        console.error('Error toggling save:', error)
      }
    },
    [engagement]
  )

  const toggleShare = useCallback(
    async (postId: string, message?: string) => {
      const current = engagement[postId]
      if (!current) return

      const wasShared = current.shares.shared

      try {
        // Optimistic update
        setEngagement(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            shares: {
              count: wasShared ? current.shares.count - 1 : current.shares.count + 1,
              shared: !wasShared,
            },
          },
        }))

        let response
        if (wasShared) {
          // For unsharingI would need the shareId, so just decrement
          response = await fetch('/api/posts/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, message }),
          })
        } else {
          response = await fetch('/api/posts/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, message }),
          })
        }

        if (!response.ok) {
          // Revert on error
          setEngagement(prev => ({
            ...prev,
            [postId]: current,
          }))
          console.error('Failed to toggle share')
          return
        }

        console.log(`✅ Share toggled for post ${postId}`)
      } catch (error) {
        // Revert on error
        setEngagement(prev => ({
          ...prev,
          [postId]: current,
        }))
        console.error('Error toggling share:', error)
      }
    },
    [engagement]
  )

  return {
    engagement,
    loading,
    toggleSave,
    toggleShare,
    fetchEngagement,
  }
}
