'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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
import { cn } from '@/lib/utils'

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

const placeholderItem: ItemDetails = {
  id: '1',
  title: 'The Architect of Silences',
  description: 'Digital narrative experience exploring silence in a noisy world',
  fullDescription: `In the void between pixels, the artist finds the resonance of a world that hasn't been coded yet. Every stroke of light captures the spaces between sound and silence, weaving a rich tapestry of ethereal geometry and digital storytelling. Based on the Digital Atelier, Elena's work focuses on the weightless transition of light across virtual canvases. As she explores the webtextless transition into the ephemeral, she illuminates the boundary between the physical and human intuition. The boundaries of the Topics help to articulate a world of endless expression.`,
  category: 'Digital Art',
  price: 29.99,
  image: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&q=80',
  creator: {
    id: 'creator-1',
    name: 'Elena Vane',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    verified: true,
    followers: 12400,
  },
  stats: {
    views: 4230,
    downloads: 842,
    sales: 56,
    rating: 4.8,
    reviews: 124,
  },
  media: [
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&q=80',
      alt: 'Main visual',
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=800&q=80',
      alt: 'Detail shot',
    },
  ],
  tags: ['digital', 'experimental', 'narrative', '3d', 'audio-reactive'],
  companionAssets: [
    {
      id: 'asset-1',
      title: 'Brush Pack',
      image: 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=400&q=80',
      type: 'Brushes',
      price: 12.99,
    },
    {
      id: 'asset-2',
      title: 'Visual Source Files',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
      type: 'Source Files',
      price: 19.99,
    },
  ],
  isLiked: false,
  isSaved: false,
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

export default function ItemDetailsPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<ItemDetails | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetch - replace with actual API call
    setTimeout(() => {
      setItem(placeholderItem)
      setIsLiked(placeholderItem.isLiked)
      setIsSaved(placeholderItem.isSaved)
      setLoading(false)
    }, 500)
  }, [params.id])

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
                  <Image
                    src={item.media[selectedMediaIndex].url}
                    alt={item.media[selectedMediaIndex].alt}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>

                {/* Media Type Badge */}
                {item.media[selectedMediaIndex].type !== 'image' && (
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
                      <Image
                        src={media.url}
                        alt={media.alt}
                        fill
                        className="object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Description Section */}
              <Card className="dream-card border-border/50">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">About this asset</h2>
                  <p className="text-muted-foreground leading-relaxed">{item.fullDescription}</p>

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
                          {(item.creator.followers / 1000).toFixed(1)}k followers
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
                    <li>✓ High-res assets (4K+)</li>
                    <li>✓ Source files included</li>
                    <li>✓ Commercial license</li>
                    <li>✓ Lifetime updates</li>
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
                        <div className="text-4xl opacity-20">✨</div>
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
