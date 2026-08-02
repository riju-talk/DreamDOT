'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Sparkles,
  Clock,
  TrendingUp,
  Eye,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    verified?: boolean
  }
  content: string
  timestamp: Date
  likes: number
  isLiked: boolean
}

interface PostDetail {
  id: string
  author: {
    id: string
    name: string
    avatar: string
    verified: boolean
    followers: number
  }
  title: string
  content: string
  media?: Array<{
    type: 'image' | 'video' | 'audio'
    url: string
    alt?: string
    thumbnail?: string
  }>
  engagement: {
    likes: number
    comments: number
    shares: number
    saves: number
    views: number
  }
  createdAt: Date
  tags: string[]
  isLiked: boolean
  isSaved: boolean
}

const placeholderPost: PostDetail = {
  id: '1',
  author: {
    id: 'user-1',
    name: 'Elena Vane',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    verified: true,
    followers: 12400,
  },
  title: 'Fragmented Realities: Series 04',
  content: `A multi-sensory exploration of digital consciousness through ethereal geometries. This series emerged from conversations on consciousness, perception, and the liminal spaces between the physical and virtual. The work interrogates the boundaries of space—questioning what happens when artist's intent meets algorithmic interpretation.

Each piece in this series marks a threshold: where imagination meets execution, where code creates the most elemental forms of existence.`,
  media: [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=1000&q=80',
      alt: 'Main artwork',
    },
  ],
  engagement: {
    likes: 1243,
    comments: 98,
    shares: 234,
    saves: 892,
    views: 5421,
  },
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  tags: ['digital-art', 'experimental', 'consciousness', '3d'],
  isLiked: false,
  isSaved: false,
}

const placeholderComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Sofia Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      verified: false,
    },
    content:
      'This transcends the usual digital art tropes. The layering technique is extraordinary.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: 124,
    isLiked: false,
  },
  {
    id: '2',
    author: {
      name: 'Marcus Design',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      verified: true,
    },
    content:
      'The intersection of geometry and narrative here is what I aspire to in my own work.',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
    likes: 89,
    isLiked: false,
  },
]

function PostDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Skeleton className="w-full h-96 rounded-2xl" />
      <Skeleton className="w-3/4 h-8" />
      <Skeleton className="w-full h-24 rounded-lg" />
    </div>
  )
}

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<PostDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    // Simulate fetch - replace with actual API call
    setTimeout(() => {
      setPost(placeholderPost)
      setComments(placeholderComments)
      setIsLiked(placeholderPost.isLiked)
      setIsSaved(placeholderPost.isSaved)
      setLikeCount(placeholderPost.engagement.likes)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleComment = async () => {
    if (!newComment.trim()) return

    setSubmittingComment(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    }

    setComments([comment, ...comments])
    setNewComment('')
    setSubmittingComment(false)
  }

  if (loading) return <PostDetailsSkeleton />
  if (!post) return <div>Post not found</div>

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 lg:px-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header with Creator Info */}
          <Card className="dream-card border-border/50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <Link
                  href={`/profile/${post.author.id}`}
                  className="flex items-center gap-3 group"
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/30 group-hover:border-primary transition-colors">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.author.name}
                      </h3>
                      {post.author.verified && <Sparkles className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </Link>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{post.title}</h1>

              <div className="space-y-3 mb-4">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/discover?tag=${tag}`}
                      className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-video bg-black/30">
                <Image
                  src={post.media[0].url}
                  alt={post.media[0].alt || 'Post media'}
                  fill
                  className="object-cover"
                  priority
                />
                {post.media[0].type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <svg className="w-8 h-8 text-primary-foreground fill-current" viewBox="0 0 24 24">
                        <path d="M5 3v18l15-9z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Engagement Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Eye, label: 'Views', value: post.engagement.views },
              { icon: Heart, label: 'Likes', value: likeCount },
              { icon: MessageCircle, label: 'Comments', value: post.engagement.comments },
              { icon: Share2, label: 'Shares', value: post.engagement.shares },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="dream-card border-border/50 p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </Card>
              )
            })}
          </motion.div>

          {/* Action Buttons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 border-border/50 hover:border-primary/50 hover:bg-card"
              onClick={handleLike}
            >
              <Heart className={cn('h-5 w-5', isLiked && 'fill-destructive text-destructive')} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="outline" className="flex-1 h-12 border-border/50 hover:border-primary/50 hover:bg-card">
              <MessageCircle className="h-5 w-5" />
              Comment
            </Button>
            <Button variant="outline" className="flex-1 h-12 border-border/50 hover:border-primary/50 hover:bg-card">
              <Share2 className="h-5 w-5" />
              Share
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 border-border/50 hover:border-primary/50"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Bookmark className={cn('h-5 w-5', isSaved && 'fill-primary text-primary')} />
            </Button>
          </motion.div>

          {/* Comments Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
            {/* Comment Input */}
            <Card className="dream-card border-border/50 p-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" alt="You" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Share your thoughts..."
                    className="bg-card border-border/50 focus-visible:ring-primary"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleComment()
                      }
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleComment}
                      disabled={!newComment.trim() || submittingComment}
                    >
                      <Send className="h-4 w-4" />
                      {submittingComment ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {comments.length} Comments
              </h3>

              <AnimatePresence mode="popLayout">
                {comments.map((comment, idx) => (
                  <motion.div
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="dream-card border-border/50 p-4 hover:border-primary/30 transition-colors">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 flex-shrink-0 border border-border/50">
                          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{comment.author.name}</h4>
                            {comment.author.verified && (
                              <Sparkles className="h-4 w-4 text-primary" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-1">{comment.content}</p>
                          <div className="flex gap-4 mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-muted-foreground hover:text-primary"
                            >
                              <Heart className="h-3 w-3" />
                              {comment.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-muted-foreground hover:text-primary"
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {comments.length > 0 && (
              <div className="text-center pt-4">
                <Button variant="outline" className="border-border/50 hover:border-primary/50">
                  Load more comments
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
