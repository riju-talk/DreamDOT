'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Download,
  Eye,
  MessageSquare,
  BookOpen,
  Zap,
  Plus,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn, isHtmlContent } from '@/lib/utils'

const FALLBACK_IMAGE =
  'https://i0.wp.com/www.innovationyourself.com/wp-content/uploads/2020/08/simplifying-controllers-action-fallback.png?fit=700%2C400&ssl=1'

// Helper to strip HTML tags from text
const stripHtmlTags = (html: string): string => {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()
}

function mimeToType(mimeType: string): 'image' | 'video' | 'audio' | '3d' {
  if (!mimeType) return 'image'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('model') || mimeType === 'application/octet-stream') return '3d'
  return 'image'
}

interface ItemDetails {
  id: string
  title: string
  description: string
  fullDescription: string
  category: string
  price: number
  image: string
  creator: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
    followers: number
  }
  stats: {
    views: number
    downloads: number
    sales: number
    rating: number
    reviews: number
  }
  media: Array<{
    type: 'image' | 'video' | 'audio' | '3d'
    url: string
    alt: string
  }>
  tags: string[]
  companionAssets?: Array<{
    id: string
    title: string
    image: string
    type: string
    price: number
  }>
  isLiked: boolean
  isSaved: boolean
}

function ItemDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="w-full h-96 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-full h-32 rounded-lg" />
          <Skeleton className="w-full h-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session } = useSession()
  const [item, setItem] = useState<ItemDetails | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSelectedMediaIndex(0)

    const loadItem = async () => {
      try {
        const response = await fetch(`/api/Items/${id}`)
        if (!response.ok) {
          throw new Error('Item not found')
        }
        const data = await response.json()
        if (cancelled) return

        const media = (data.images || []).map((m: any) => ({
          type: mimeToType(m.mimeType),
          url: m.url,
          alt: m.alt || data.title || 'Item media',
        }))

        setItem({
          id: data.id,
          title: data.title,
          description: data.description || '',
          fullDescription: data.metadata?.script || '',
          category: data.category,
          price: data.price || 0,
          image: media[0]?.url || FALLBACK_IMAGE,
          creator: {
            id: data.creator?.id || '',
            name: data.creator?.name || 'Unknown',
            username: data.creator?.username || '',
            avatar: data.creator?.avatar || FALLBACK_IMAGE,
            verified: data.creator?.verified || false,
            followers: 0,
          },
          stats: {
            views: 0,
            downloads: 0,
            sales: data.sales || 0,
            rating: data.rating || 0,
            reviews: data.reviews || 0,
          },
          media,
          tags: data.tags || [],
          isLiked: false,
          isSaved: data.userInteraction?.isSaved || false,
        })
      } catch (error) {
        console.error('Failed to load item:', error)
        if (!cancelled) setItem(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id && id !== 'undefined') {
      loadItem()
    } else {
      setLoading(false)
      setItem(null)
    }

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <ItemDetailsSkeleton />
  if (!item) return <div>Item not found</div>

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Media Viewer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Main Image */}
              <div className="relative group overflow-hidden rounded-2xl bg-black/30 aspect-square lg:aspect-auto lg:h-96">
                <motion.div
                  key={selectedMediaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <img
                    src={item.media[selectedMediaIndex]?.url || item.image}
                    alt={item.media[selectedMediaIndex]?.alt || item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Media Type Badge */}
                {item.media[selectedMediaIndex]?.type && item.media[selectedMediaIndex].type !== 'image' && (
                  <Badge className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm">
                    {item.media[selectedMediaIndex].type.toUpperCase()}
                  </Badge>
                )}

                {/* View Count Overlay */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {item.stats.views.toLocaleString()}
                </div>
              </div>

              {/* Media Thumbnails */}
              {item.media.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {item.media.map((media, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMediaIndex(idx)}
                      className={cn(
                        'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                        selectedMediaIndex === idx
                          ? 'border-primary shadow-lg shadow-primary/50'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <img
                        src={media.url}
                        alt={media.alt}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Description Section */}
              <Card className="dream-card border-border/50">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">About this asset</h2>
                  {item.category === 'writing' || isHtmlContent(item.fullDescription) ? (
                    <div
                      className="text-muted-foreground leading-relaxed [&_p]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-semibold [&_strong]:text-foreground [&_br]:mb-2"
                      dangerouslySetInnerHTML={{ __html: item.fullDescription }}
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.fullDescription}</p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Companion Assets */}
              {item.companionAssets && item.companionAssets.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Companion Assets</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {item.companionAssets.map((asset) => (
                      <motion.div
                        key={asset.id}
                        whileHover={{ y: -4 }}
                        className="group cursor-pointer"
                      >
                        <Card className="dream-card overflow-hidden h-full hover:border-primary/50 transition-colors duration-200">
                          <div className="relative w-full h-40 overflow-hidden bg-black/20">
                            <Image
                              src={asset.image}
                              alt={asset.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-4">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {asset.type}
                            </Badge>
                            <h4 className="font-medium text-sm line-clamp-2">{asset.title}</h4>
                            <p className="text-primary font-semibold mt-2">${asset.price}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right: Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 lg:sticky lg:top-4 h-fit"
            >
              {/* Title & Price */}
              <Card className="dream-card border-border/50 space-y-4 p-6">
                <div className="flex items-start gap-2">
                  <h1 className="text-3xl font-bold text-foreground leading-tight flex-1">{item.title}</h1>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold">Required</Badge>
                </div>
                <p className="text-muted-foreground">{item.description}</p>

                <div className="pt-2 border-t border-border/50">
                  <div className="text-4xl font-bold text-primary mb-1">${item.price}</div>
                  <Badge className="bg-primary/10 text-primary">{item.category}</Badge>
                </div>
              </Card>

              {/* Creator Info */}
              <Card className="dream-card border-border/50 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/profile/${item.creator.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar className="h-12 w-12 border-2 border-primary/30 group-hover:border-primary transition-colors">
                        <AvatarImage src={item.creator.avatar} alt={item.creator.name} />
                        <AvatarFallback>{item.creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.creator.name}
                          </h4>
                          {item.creator.verified && <Sparkles className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.creator.followers > 0
                            ? `${(item.creator.followers / 1000).toFixed(1)}k followers`
                            : item.creator.username
                              ? `@${item.creator.username}`
                              : 'Creator'}
                        </p>
                      </div>
                    </Link>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-primary/50 hover:border-primary hover:bg-primary/10 group"
                  >
                    <Sparkles className="h-4 w-4 group-hover:text-primary" />
                    Work with Creator
                  </Button>
                </div>
              </Card>

              {/* Stats */}
              <Card className="dream-card border-border/50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{item.stats.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.stats.reviews} reviews</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Downloads</p>
                    <p className="font-semibold text-lg">{item.stats.downloads}</p>
                    <p className="text-xs text-muted-foreground">{item.stats.sales} sales</p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {session?.user?.id && item.creator.id === (session as any).user.id && (
                  <Link href={`/items/${id}/edit`} className="block">
                    <Button variant="outline" className="w-full h-11 border-primary/50 hover:bg-primary/10">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Edit Item
                    </Button>
                  </Link>
                )}

                <Button className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                  <ShoppingCart className="h-5 w-5" />
                  Purchase
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 border-border/50 hover:bg-card hover:border-primary/50"
                >
                  <Download className="h-4 w-4" />
                  Free Preview
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-1 h-11"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={cn('h-5 w-5', isLiked && 'fill-destructive text-destructive')}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-1 h-11"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <BookOpen className={cn('h-5 w-5', isSaved && 'text-primary')} />
                  </Button>
                  <Button variant="ghost" size="icon" className="flex-1 h-11">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Resources Info */}
              <Card className="dream-card border-border/50 p-4 bg-primary/5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                    <Zap className="h-4 w-4" />
                    Includes
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>âœ“ High-res assets (4K+)</li>
                    <li>âœ“ Source files included</li>
                    <li>âœ“ Commercial license</li>
                    <li>âœ“ Lifetime updates</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Related Items Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 pt-8 border-t border-border/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">More from {item.creator.name}</h2>
              <Button variant="ghost" className="text-primary hover:bg-primary/10">
                View all
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                >
                  <Card className="dream-card overflow-hidden hover:border-primary/50 transition-colors duration-200 h-full">
                    <div className="relative w-full h-48 overflow-hidden bg-black/20">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                        <div className="text-4xl opacity-20">âœ¨</div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">Similar Asset {i}</h3>
                      <p className="text-primary font-bold">$19.99</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}

