import { useState, useEffect, useCallback } from 'react'

interface LikeData {
  count: number
  liked: boolean
}

interface LikesMap {
  [postId: string]: LikeData
}

export function useLikes(postIds: string[]) {
  const [likes, setLikes] = useState<LikesMap>({})
  const [loading, setLoading] = useState(false)

  // Fetch likes for posts
  const fetchLikes = useCallback(async () => {
    if (!postIds || postIds.length === 0) return

    setLoading(true)
    try {
      const query = new URLSearchParams({
        postIds: postIds.join(','),
      })

      const response = await fetch(`/api/posts/likes?${query}`)
      if (!response.ok) throw new Error('Failed to fetch likes')

      const data = await response.json()
      setLikes(data.likes || {})

      console.log(`✅ Fetched likes for ${postIds.length} posts`)
    } catch (error) {
      console.error('Error fetching likes:', error)
    } finally {
      setLoading(false)
    }
  }, [postIds])

  // Initial fetch
  useEffect(() => {
    fetchLikes()
  }, [fetchLikes])

  // Toggle like for a post
  const toggleLike = useCallback(
    async (postId: string) => {
      const currentLike = likes[postId]
      if (!currentLike) return

      const isLiked = currentLike.liked

      try {
        // Optimistic update
        setLikes(prev => ({
          ...prev,
          [postId]: {
            count: isLiked ? currentLike.count - 1 : currentLike.count + 1,
            liked: !isLiked,
          },
        }))

        // Make API call
        const method = isLiked ? 'DELETE' : 'POST'
        const response = await fetch(`/api/posts/${postId}/like`, { method })

        if (!response.ok) {
          // Revert on error
          setLikes(prev => ({
            ...prev,
            [postId]: currentLike,
          }))
          console.error('Failed to toggle like')
          return
        }

        console.log(`✅ Like toggled for post ${postId}`)
      } catch (error) {
        // Revert on error
        setLikes(prev => ({
          ...prev,
          [postId]: currentLike,
        }))
        console.error('Error toggling like:', error)
      }
    },
    [likes]
  )

  // Refresh likes for a post
  const refreshLike = useCallback(
    async (postId: string) => {
      try {
        const query = new URLSearchParams({ postIds: postId })
        const response = await fetch(`/api/posts/likes?${query}`)
        if (!response.ok) throw new Error('Failed to fetch likes')

        const data = await response.json()
        setLikes(prev => ({
          ...prev,
          ...data.likes,
        }))
      } catch (error) {
        console.error('Error refreshing like:', error)
      }
    },
    []
  )

  return {
    likes,
    loading,
    toggleLike,
    refreshLike,
    fetchLikes,
  }
}
