"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { Heart, MessageCircle, Share2, Bookmark, Loader2, Search, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { useLikes } from "@/hooks/useLikes"
import { useEngagement } from "@/hooks/useEngagement"

interface Post {
  id: string
  userId: string
  content: string
  media?: { type: string; url: string; alt?: string }[]
  createdAt: string
  likes: string[]
  comments: { userId: string; text: string; timestamp: string }[]
  author?: { id: string; name: string; avatar: string }
  title?: string
}

interface FeedResponse {
  posts: Post[]
  hasMore: boolean
  total: number
}

interface Comment {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: string
}

function PostSkeleton() {
  return (
    <Card className="border border-border bg-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-3 bg-muted" />
              <Skeleton className="w-16 h-2 bg-muted" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="w-32 h-6 bg-muted" />
        <Skeleton className="w-full h-16 bg-muted" />
        <Skeleton className="w-full h-48 bg-muted rounded-lg" />
      </CardContent>
    </Card>
  )
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<"following" | "for-you" | "trending">("for-you")
  const [search, setSearch] = useState("")
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)

  const { ref, inView } = useInView()
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const postIds = posts.map(p => p.id)
  const { likes, toggleLike } = useLikes(postIds)
  const { engagement, toggleSave, toggleShare } = useEngagement(postIds)

  const fetchPosts = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        setError(null)
        const query = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
          filter,
          search,
        })

        const response = await fetch(`/api/posts/feed?${query}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch posts`)
        }

        const data = await response.json()

        if (!data.posts || !Array.isArray(data.posts)) {
          throw new Error("Invalid response format from server")
        }

        if (reset) {
          setPosts(data.posts)
          setPage(1)
        } else {
          setPosts((prev) => [...prev, ...data.posts])
        }
        setHasMore(data.hasMore ?? false)
      } catch (error) {
        console.error("Error fetching posts:", error)
        const message = error instanceof Error ? error.message : "Failed to load posts. Please try again."
        setError(message)
      } finally {
        setLoading(false)
        setLoadingMore(false)
        setRetrying(false)
      }
    },
    [filter, search]
  )

  useEffect(() => {
    setLoading(true)
    fetchPosts(1, true)
  }, [filter, search, fetchPosts])

  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading) {
      setLoadingMore(true)
      fetchPosts(page + 1)
      setPage((p) => p + 1)
    }
  }, [inView, hasMore, loadingMore, loading, page, fetchPosts])

  const handleSearch = (value: string) => {
    setSearch(value)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1)
    }, 500)
  }

  const handleRetry = () => {
    setRetrying(true)
    setLoading(true)
    fetchPosts(1, true)
  }

  const openCommentModal = async (post: Post) => {
    setSelectedPost(post)
    setCommentModalOpen(true)
    setLoadingComments(true)

    try {
      const response = await fetch(`/api/posts/${post.id}/comment?page=1&limit=50`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      
      if (response.ok) {
        const data = await response.json()
        setComments(Array.isArray(data.comments) ? data.comments : [])
      } else {
        setComments([])
      }
    } catch (error) {
      console.error("Error loading comments:", error)
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!selectedPost || !commentText.trim()) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      })

      if (!response.ok) {
        throw new Error(`Failed to submit comment: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.comment) {
        setComments([...comments, data.comment])
        setCommentText("")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to post comment"
      setError(errorMessage)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleToggleLike = (postId: string) => {
    toggleLike(postId)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4 mb-8 sticky top-0 z-40 bg-background pt-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 border-b border-border overflow-x-auto">
              {(["following", "for-you", "trending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-3 font-semibold text-sm capitalize transition-colors border-b-2 whitespace-nowrap ${
                    filter === f
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
                >
                  {f === "for-you" ? "For You" : f === "following" ? "Following" : "Trending"}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border text-foreground placeholder-muted-foreground rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-destructive/20 border border-destructive/50 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <p className="text-foreground">{error}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                disabled={retrying}
                className="text-primary border-primary hover:bg-primary/10"
              >
                {retrying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Retry"}
              </Button>
            </motion.div>
          )}

          {loading && posts.length === 0 ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts found. Try a different filter or search term.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <motion.div key={post.id} variants={itemVariants}>
                    <Card className="border border-border bg-card hover:border-primary transition-all overflow-hidden group">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                              {post.author?.avatar && (
                                <Image
                                  src={post.author.avatar}
                                  alt={post.author?.name || "User"}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-foreground">
                                {post.author?.name || "Anonymous"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary hover:bg-muted"
                          >
                            Follow
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {post.title && (
                          <h2 className="text-lg sm:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                            {post.title}
                          </h2>
                        )}

                        <p className="text-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">
                          {post.content}
                        </p>

                        {post.media && post.media.length > 0 && (
                          <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={post.media[0].url}
                              alt={post.media[0].alt || "Post image"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 text-xs sm:text-sm text-muted-foreground border-t border-border">
                          <span>{likes[post.id]?.count || 0} likes</span>
                          <span>{comments.length || 0} comments</span>
                        </div>

                        <div className="flex gap-1 sm:gap-2 pt-4 border-t border-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-muted-foreground hover:text-primary hover:bg-muted text-xs sm:text-sm"
                            onClick={() => handleToggleLike(post.id)}
                          >
                            <Heart
                              className={`h-4 w-4 mr-1 sm:mr-2 transition-colors ${
                                likes[post.id]?.liked ? "fill-primary text-primary" : ""
                              }`}
                            />
                            <span className="hidden sm:inline">Like</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-muted-foreground hover:text-primary hover:bg-muted text-xs sm:text-sm"
                            onClick={() => openCommentModal(post)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Comment</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-muted-foreground hover:text-primary hover:bg-muted text-xs sm:text-sm"
                            onClick={() => toggleShare(post.id)}
                          >
                            <Share2
                              className={`h-4 w-4 mr-1 sm:mr-2 transition-colors ${
                                engagement[post.id]?.shares.shared ? "fill-primary text-primary" : ""
                              }`}
                            />
                            <span className="hidden sm:inline">Share</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-muted-foreground hover:text-primary hover:bg-muted text-xs sm:text-sm"
                            onClick={() => toggleSave(post.id)}
                          >
                            <Bookmark
                              className={`h-4 w-4 mr-1 sm:mr-2 transition-colors ${
                                engagement[post.id]?.saves.saved ? "fill-primary text-primary" : ""
                              }`}
                            />
                            <span className="hidden sm:inline">Save</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}

              {hasMore && (
                <div ref={ref} className="text-center py-8">
                  {loadingMore && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <Dialog open={commentModalOpen} onOpenChange={setCommentModalOpen}>
          <DialogContent className="bg-card border border-border max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Comments</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{comment.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{comment.text}</p>
                    <div className="border-t border-border" />
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-background border border-border text-foreground placeholder-muted-foreground rounded-lg p-3 focus:border-primary focus:outline-none transition-colors text-sm resize-none"
                rows={3}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || submittingComment}
                className="w-full"
              >
                {submittingComment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}
