'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthenticatedLayout } from '../../../components/authenticated-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useInView } from 'react-intersection-observer'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Star,
  Eye,
  Play,
  Music,
  ShoppingCart,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  X,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

type FeedItemType = 'post' | 'item'

interface Post {
  id: string
  userId: string
  content: string
  media?: { type: string; url: string; alt?: string }[]
  createdAt: string
  likes: string[]
  comments: { userId: string; text: string; timestamp: string }[]
  author?: { id: string; name: string; avatar: string; verified?: boolean }
  type: 'post'
}

interface FeedItem {
  id: string
  title: string
  description?: string
  category: string
  price: number
  image: string
  rating: number
  sales: number
  creator: {
    id: string
    name: string
    avatar: string
    verified?: boolean
  }
  itemType?: 'image' | 'video' | 'audio' | '3d'
  type: 'item'
  views?: number
}

type FeedContent = Post | FeedItem

function FeedItemSkeleton() {
  return (
    <Card className="dream-card border-border/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
    >
      <Card className="dream-card border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 group">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Link href={`/profile/${post.author?.id}`} className="flex items-center gap-3 group/author">
              <Avatar className="h-10 w-10 border border-border/50 group-hover/author:border-primary transition-colors">
                <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
                <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-foreground group-hover/author:text-primary transition-colors">
                    {post.author?.name}
                  </p>
                  {post.author?.verified && <Sparkles className="h-3 w-3 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>

          {/* Content */}
          <p className="text-muted-foreground text-sm mb-4">{post.content}</p>

          {/* Image */}
          {post.media && post.media.length > 0 && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 bg-black/30">
              <Image
                src={post.media[0].url}
                alt={post.media[0].alt || 'Post media'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}

          {/* Engagement */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b border-border/30">
            <div className="flex gap-4">
              <span>{post.likes?.length || 0} Likes</span>
              <span>{post.comments?.length || 0} Comments</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-muted-foreground hover:text-primary group/btn"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn('h-4 w-4', isLiked && 'fill-destructive text-destructive')} />
              Like
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-primary">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-muted-foreground hover:text-primary"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Bookmark className={cn('h-4 w-4', isSaved && 'fill-primary text-primary')} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ItemCard({ item }: { item: FeedItem }) {
  const TypeIcon = item.itemType === 'video' ? Play : item.itemType === 'audio' ? Music : Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/items/${item.id}`}>
        <Card className="dream-card border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full">
          {/* Image */}
          <div className="relative w-full h-64 bg-black/30 overflow-hidden">
            <Image
              src={item.image || item.media?.[0]?.url || 'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1699909962/fallback_image_header/fallback_image_header-png?_i=AA'}
              alt={item.title || 'Item'}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => {
                // Fallback handled by Next.js Image component
              }}
            />

            {/* Type Badge */}
            <Badge className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm capitalize">
              {item.itemType || 'item'}
            </Badge>

            {/* Type Icon Overlay */}
            {item.itemType && item.itemType !== 'image' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                  <TypeIcon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-4">
            {/* Creator */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-7 w-7 border border-border/50">
                <AvatarImage src={item.creator?.avatar || '/placeholder.svg'} alt={item.creator?.name || 'Creator'} />
                <AvatarFallback>{item.creator?.name?.charAt(0) || 'C'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold text-muted-foreground truncate group-hover:text-primary transition-colors">
                    {item.creator?.name || 'Creator'}
                  </p>
                  {item.creator?.verified && <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />}
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
              {item.title}
            </h3>

            {/* Category & Price */}
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                {item.category}
              </Badge>
              <p className="text-primary font-bold">${item.price}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 text-xs text-muted-foreground pt-3 border-t border-border/30">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {item.rating}
              </div>
              <div className="flex items-center gap-1">
                <ShoppingCart className="h-3 w-3" />
                {item.sales}
              </div>
              {item.views && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.views}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export default function FeedPage() {
  const [feedContent, setFeedContent] = useState<FeedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [postDescription, setPostDescription] = useState('')
  const [postImages, setPostImages] = useState<string[]>([])
  const [submittingPost, setSubmittingPost] = useState(false)
  const { ref: loadMoreRef, inView } = useInView()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initial load
  useEffect(() => {
    fetchFeed(1, true)
  }, [])

  // Load more on scroll
  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading) {
      fetchFeed(page + 1, false)
    }
  }, [inView, hasMore, loadingMore, loading, page])

  const fetchFeed = async (pageNum: number, reset: boolean = false) => {
    try {
      setError(null)
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
      })

      const response = await fetch(`/api/posts/feed?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch feed')
      }

      const data = await response.json()

      if (reset) {
        setFeedContent(data.feed || data.posts || [])
      } else {
        setFeedContent((prev) => [...prev, ...(data.feed || data.posts || [])])
      }

      setHasMore(data.pagination?.hasMore ?? false)
      if (!reset) {
        setPage(pageNum)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load feed'
      setError(message)
      console.error('Feed error:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleSearch = (value: string) => {
    setPage(1)
    setFeedContent([])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setPostImages((prev) => [...prev, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items
    if (items) {
      Array.from(items).forEach((item) => {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (event.target?.result) {
                setPostImages((prev) => [...prev, event.target.result as string])
              }
            }
            reader.readAsDataURL(file)
          }
        }
      })
    }
  }

  const removeImage = (index: number) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreatePost = async () => {
    if (!postDescription.trim()) return

    setSubmittingPost(true)
    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postDescription,
          media: postImages.map((img) => ({
            type: 'image',
            url: img,
          })),
        }),
      })

      if (response.ok) {
        setCreatePostOpen(false)
        setPostDescription('')
        setPostImages([])
        // Refresh feed
        setPage(1)
        setFeedContent([])
        fetchFeed(1, true)
      }
    } catch (err) {
      console.error('Error creating post:', err)
    } finally {
      setSubmittingPost(false)
    }
  }



  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 lg:px-0">
        {/* Stories Section - Above Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.0 }}
          className="mb-8"
        >
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Your Story Bubble */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary/60 cursor-pointer hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center p-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <div className="flex items-center justify-center w-full h-full rounded-full relative z-10">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs font-semibold text-foreground mt-1 text-center">Your Story</p>
            </motion.div>

            {/* Story Bubbles */}
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative group cursor-pointer">
                  {/* Circular Story Bubble */}
                  <div className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-all group-hover:shadow-lg flex items-center justify-center relative ${
                    i % 2 === 0 
                      ? 'border-primary/70 shadow-lg shadow-primary/20 bg-gradient-to-br from-primary/30 to-primary/10' 
                      : 'border-border/60 group-hover:border-primary/70 bg-gradient-to-br from-secondary/30 to-accent/10'
                  }`}>
                    {/* Story Content */}
                    <div className="text-2xl">✨</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  </div>

                  {/* Creator Avatar - Ring Style */}
                  <div className="absolute -bottom-1 -right-1 z-20">
                    <Avatar className="h-5 w-5 border-2 border-primary/60 ring-2 ring-background">
                      <AvatarFallback className="text-[8px] font-bold">U{i}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground mt-2 text-center">Creator {i}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Post Bar */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sticky top-4 z-30">
          <Button
            onClick={() => setCreatePostOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 w-full"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm font-medium">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchFeed(1, true)}
              className="ml-auto"
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Feed Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <FeedItemSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {feedContent.length > 0 ? (
                <>
                  {feedContent.map((item, index) => (
                    <div key={item.id ?? index}>
                      {item.type === 'post' ? (
                        <PostCard post={item as Post} />
                      ) : (
                        <ItemCard item={item as FeedItem} />
                      )}
                    </div>
                  ))}

                  {/* Load More Trigger */}
                  {hasMore && (
                    <div ref={loadMoreRef} className="py-8">
                      {loadingMore ? (
                        <div className="space-y-6">
                          <FeedItemSkeleton />
                          <FeedItemSkeleton />
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-muted-foreground">Scroll for more content</p>
                        </div>
                      )}
                    </div>
                  )}

                  {!hasMore && feedContent.length > 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>You've reached the end of the feed</p>
                      <Button
                        variant="outline"
                        className="mt-4 border-border/50"
                        onClick={() => {
                          setPage(1)
                          setFeedContent([])
                          fetchFeed(1, true)
                        }}
                      >
                        Start over
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No content found</p>
                  <Button variant="outline" onClick={() => {
                    setPage(1)
                    setFeedContent([])
                    fetchFeed(1, true)
                  }}>
                    Reload
                  </Button>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Post Modal */}
      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent className="bg-card border border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Content Textarea */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">
                What's on your mind?
              </label>
              <Textarea
                placeholder="Share your thoughts..."
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                onPaste={handlePaste}
                className="bg-background border-border/50 focus-visible:ring-primary min-h-32 resize-none"
              />
            </div>

            {/* Image Preview Grid */}
            {postImages.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Attached Images</label>
                <div className="grid grid-cols-3 gap-3">
                  {postImages.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-border/50">
                      <Image
                        src={img}
                        alt={`Preview ${idx}`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Add Images</label>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-border/50 hover:border-primary/50 gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Attach Images
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: JPG, PNG, GIF (max 5 images)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border/30">
              <Button
                variant="outline"
                onClick={() => setCreatePostOpen(false)}
                disabled={submittingPost}
                className="flex-1 border-border/50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={!postDescription.trim() || submittingPost}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submittingPost ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}
