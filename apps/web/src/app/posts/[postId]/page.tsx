'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  MessageSquare,
  Share2,
  MapPin,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  ArrowLeft,
  Bookmark,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

interface PostData {
  id: string
  userId: string
  content: string
  media: Array<{ url: string; type: string }>
  visibility: boolean
  createdAt: string
  likes: string[]
  comments: Array<{
    id: string
    userId: string
    content: string
    createdAt: string
    user: {
      username: string
      display_name: string
      avatar_url: string
    }
  }>
  user: {
    id: string
    username: string
    display_name: string
    avatar_url: string
    verified: boolean
  }
  analytics: {
    likes_count: number
    comments_count: number
    views_count: number
    shares_count: number
  }
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const postId = params?.postId as string

  const [post, setPost] = useState<PostData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [isCommentingSubmit, setIsCommentingSubmit] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/posts/${postId}`)

        if (!res.ok) {
          if (res.status === 404) {
            router.push('/feed')
          }
          return
        }

        const data = await res.json()
        setPost(data.post)
        setLikeCount(data.post.analytics.likes_count || 0)
        setIsLiked(data.post.likes?.includes(session?.user?.id) || false)
        setComments(data.post.comments || [])
      } catch (error) {
        console.error('[Post] Error loading post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (postId && mounted) {
      loadPost()
    }
  }, [postId, session?.user?.id, mounted])

  const handleLike = async () => {
    if (!session?.user?.id) return

    try {
      setIsLiking(true)
      const method = isLiked ? 'DELETE' : 'POST'
      const res = await fetch(`/api/posts/${postId}/like`, { method })

      if (res.ok) {
        setIsLiked(!isLiked)
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
      }
    } catch (error) {
      console.error('[Post] Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleSave = async () => {
    if (!session?.user?.id) return

    try {
      setIsSaving(true)
      const method = isSaved ? 'DELETE' : 'POST'
      const res = await fetch(`/api/posts/${postId}/save`, { method })

      if (res.ok) {
        setIsSaved(!isSaved)
      }
    } catch (error) {
      console.error('[Post] Error toggling save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id || !commentText.trim()) return

    try {
      setIsCommentingSubmit(true)
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      })

      if (res.ok) {
        const data = await res.json()
        setComments([...comments, data.comment])
        setCommentText('')
      }
    } catch (error) {
      console.error('[Post] Error adding comment:', error)
    } finally {
      setIsCommentingSubmit(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-[#5a8c5a] dark:text-primary" />
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!post) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Post not found</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
        >
          {/* Post Header */}
          <div className="flex items-start justify-between p-6 border-b border-border/50">
            <Link href={`/profile/${post.user.id}`} className="flex items-center gap-4 flex-1">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#5a8c5a] to-[#4a7c4a] dark:from-primary dark:to-primary/80 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {post.user.avatar_url ? (
                  <Image
                    src={post.user.avatar_url}
                    alt={post.user.display_name || post.user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  (post.user.display_name || post.user.username || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground">
                    {post.user.display_name || post.user.username}
                  </h3>
                  {post.user.verified && (
                    <span className="text-[#5a8c5a] dark:text-primary font-bold">✓</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">@{post.user.username}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </Link>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="p-6 border-b border-border/50">
            {post.content && (
              <p className="text-base leading-relaxed text-foreground/90 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {/* Media Gallery */}
            {post.media?.length > 0 && (
              <div className={`grid gap-4 mt-4 ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.media.map((media, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={media.url}
                      alt={`Post media ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Post Stats */}
          <div className="px-6 py-4 flex items-center justify-between text-sm text-muted-foreground border-b border-border/50">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-[#5a8c5a] text-[#5a8c5a] dark:fill-primary dark:text-primary" />
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </span>
            <span className="flex items-center gap-1.5">
              <Share className="w-4 h-4" />
              {post.analytics.shares_count} {post.analytics.shares_count === 1 ? 'Share' : 'Shares'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex divide-x divide-border/50">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex-1 py-4 flex items-center justify-center gap-2 font-semibold text-muted-foreground hover:text-[#5a8c5a] dark:hover:text-primary hover:bg-muted/50 transition-colors"
            >
              {isLiking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#5a8c5a] text-[#5a8c5a] dark:fill-primary dark:text-primary' : ''}`} />
              )}
              {isLiked ? 'Liked' : 'Like'}
            </button>
            <button className="flex-1 py-4 flex items-center justify-center gap-2 font-semibold text-muted-foreground hover:text-[#5a8c5a] dark:hover:text-primary hover:bg-muted/50 transition-colors">
              <MessageCircle className="w-5 h-5" />
              Reply
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-4 flex items-center justify-center gap-2 font-semibold text-muted-foreground hover:text-[#5a8c5a] dark:hover:text-primary hover:bg-muted/50 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-[#5a8c5a] text-[#5a8c5a] dark:fill-primary dark:text-primary' : ''}`} />
              )}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="flex gap-4">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#5a8c5a] to-[#4a7c4a] dark:from-primary dark:to-primary/80 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Your avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  (session?.user?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none resize-none text-sm"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCommentText('')}
                    className="px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!commentText.trim() || isCommentingSubmit}
                    className="px-6 bg-[#5a8c5a] dark:bg-primary text-white hover:bg-[#4a7c4a] dark:hover:bg-primary/90"
                  >
                    {isCommentingSubmit ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-bold uppercase tracking-wider text-sm">No comments yet</p>
                <p className="text-sm mt-1">Be the first to share your thoughts.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-card border border-border rounded-xl p-4">
                  <Link href={`/profile/${comment.userId}`} className="flex items-center gap-3 mb-2">
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#5a8c5a] to-[#4a7c4a] dark:from-primary dark:to-primary/80 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                      {comment.user?.avatar_url ? (
                        <Image
                          src={comment.user.avatar_url}
                          alt={comment.user?.display_name || comment.user?.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        (comment.user?.display_name || comment.user?.username || 'U').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {comment.user?.display_name || comment.user?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  <p className="text-sm text-foreground/90 ml-13 mt-1">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
