'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Button } from '@/components/ui/button'
import { Loader2, MessageSquare, Share2, MapPin, Globe, Link as LinkIcon, Check, UserPlus, UserCheck, Heart, Star, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

interface ProfileData {
  id: string
  email: string
  name: string
  username?: string | null
  avatar?: string | null
  banner?: string | null
  bio?: string | null
  location?: string | null
  website?: string | null
  socialLinks?: unknown
  followers: number
  following: number
  joinedAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { theme } = useTheme()
  const userId = params?.userId as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isDmLoading, setIsDmLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'products'>('posts')
  const [mounted, setMounted] = useState(false)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userItems, setUserItems] = useState<any[]>([])
  const [isContentLoading, setIsContentLoading] = useState(false)

  const isOwnProfile = session?.user?.id === userId

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/users/${userId}`)

        if (!res.ok) {
          if (res.status === 404) {
            router.push('/profile')
          }
          return
        }

        const data = await res.json()
        setProfile(data.user)
        setIsFollowing(data.isFollowing)
      } catch (error) {
        console.error('[Profile] Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      loadProfile()
      loadContent()
    }
  }, [userId, router])

  const loadContent = async () => {
    try {
      setIsContentLoading(true)
      const res = await fetch(`/api/users/${userId}/content`)

      if (res.ok) {
        const data = await res.json()
        setUserPosts(data.posts || [])
        setUserItems(data.items || [])
      }
    } catch (error) {
      console.error('[Profile] Error loading content:', error)
    } finally {
      setIsContentLoading(false)
    }
  }

  const handleFollowClick = async () => {
    try {
      setIsFollowLoading(true)
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`/api/users/${userId}/follow`, { method })

      if (res.ok) {
        const data = await res.json()
        setIsFollowing(data.isFollowing)
        setProfile((prev) => prev && {
          ...prev,
          followers: Math.max(0, prev.followers + (data.isFollowing ? 1 : -1)),
        })
      }
    } catch (error) {
      console.error('[Profile] Error toggling follow:', error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleOpenDm = async () => {
    try {
      setIsDmLoading(true)
      // Reuse an existing direct conversation if present
      const listRes = await fetch('/api/chat/conversations')
      if (listRes.ok) {
        const list = await listRes.json()
        const existing = (list.conversations || []).find(
          (c: any) => c.type === 'direct' && c.participants?.some((p: any) => p.id === userId)
        )
        if (existing) {
          router.push('/messages')
          return
        }
      }

      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'direct', participants: [userId] }),
      })

      if (res.ok) {
        router.push('/messages')
      }
    } catch (error) {
      console.error('[Profile] Error opening DM:', error)
    } finally {
      setIsDmLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('[Profile] Error copying link:', error)
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

  if (!profile) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  const displayName = profile.name || profile.username || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <AuthenticatedLayout fullBleed>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-48 sm:h-64 w-full bg-gradient-to-br from-[#5a8c5a]/20 dark:from-primary/20 to-[#5a8c5a]/5 dark:to-primary/5 overflow-hidden"
        >
          {profile.banner && (
            <Image
              src={profile.banner}
              alt="Profile banner"
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-[#5a8c5a]/10 dark:bg-primary/10 blur-3xl" />
            <div className="absolute -right-32 top-1/3 w-80 h-80 rounded-full bg-[#5a8c5a]/5 dark:bg-primary/5 blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-10 -mt-24 sm:-mt-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg"
          >
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center mb-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-shrink-0 -mt-12 sm:-mt-20"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#5a8c5a] to-[#4a7c4a] dark:from-primary dark:to-primary/80 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl border-4 border-background shadow-lg overflow-hidden relative">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
              </motion.div>

              {/* Profile Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-grow"
              >
                <div className="mb-4">
                  <h1 className="text-3xl sm:text-4xl font-black italic font-serif text-foreground mb-1">
                    {displayName}
                  </h1>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    @{profile.username || profile.id.slice(0, 8)}
                  </p>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-base leading-relaxed text-foreground/80 mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                {/* About Row */}
                <div className="flex flex-wrap gap-3 text-sm mb-6">
                  {profile.location && (
                    <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-[#5a8c5a] dark:text-primary" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#5a8c5a] dark:text-primary hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="truncate">{profile.website}</span>
                    </a>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex gap-6 mb-6 pb-6 border-b border-border">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col"
                  >
                    <span className="text-xl sm:text-2xl font-black text-[#5a8c5a] dark:text-primary">
                      {profile.followers}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Followers
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="flex flex-col"
                  >
                    <span className="text-xl sm:text-2xl font-black text-[#5a8c5a] dark:text-primary">
                      {profile.following}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Following
                    </span>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap gap-3"
                >
                  {!isOwnProfile && (
                    <>
                      <Button
                        onClick={handleFollowClick}
                        disabled={isFollowLoading}
                        className={
                          isFollowing
                            ? 'h-11 rounded-full border-2 border-[#5a8c5a] dark:border-primary text-[#5a8c5a] dark:text-primary px-6 text-sm font-black uppercase tracking-wider hover:bg-[#5a8c5a]/10 dark:hover:bg-primary/10 transition-all'
                            : 'h-11 rounded-full bg-[#5a8c5a] dark:bg-primary px-6 text-sm font-black uppercase tracking-wider text-white dark:text-primary-foreground hover:bg-[#4a7c4a] dark:hover:bg-primary/90 transition-all shadow-lg'
                        }
                      >
                        {isFollowLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Loading
                          </>
                        ) : isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleOpenDm}
                        disabled={isDmLoading}
                        className="h-11 w-11 rounded-full border-border hover:border-[#5a8c5a] dark:hover:border-primary"
                        aria-label="Send message"
                      >
                        {isDmLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <MessageSquare className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShare}
                        className="h-11 w-11 rounded-full border-border hover:border-[#5a8c5a] dark:hover:border-primary"
                        aria-label="Copy profile link"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-[#5a8c5a] dark:text-primary" />
                        ) : (
                          <Share2 className="w-5 h-5" />
                        )}
                      </Button>
                    </>
                  )}
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      onClick={() => router.push('/settings')}
                      className="h-11 rounded-full border-[#5a8c5a] dark:border-primary text-[#5a8c5a] dark:text-primary px-6 font-bold"
                    >
                      Edit Profile
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 sm:mt-12"
          >
            {/* Tab Navigation */}
            <div className="flex gap-2 sm:gap-4 border-b border-border mb-8">
              {(['posts', 'products'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 font-bold uppercase tracking-wider text-sm transition-all relative ${
                    activeTab === tab
                      ? 'text-[#5a8c5a] dark:text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'posts' ? 'Posts' : 'Products'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5a8c5a] dark:bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            {activeTab === 'posts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {isContentLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-[#5a8c5a] dark:text-primary" />
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="font-bold uppercase tracking-wider text-sm">No posts yet</p>
                    <p className="text-sm mt-1">This creator hasn't posted anything.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    {userPosts.map((post) => (
                      <div
                        key={post.id}
                        className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden hover:border-[#5a8c5a] dark:hover:border-primary transition-colors group"
                      >
                        {/* Header */}
                        <div className="flex items-center gap-3 p-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5a8c5a] to-[#4a7c4a] dark:from-primary dark:to-primary/80 flex items-center justify-center text-white text-sm font-bold overflow-hidden relative flex-shrink-0">
                            {post.user?.avatar_url ? (
                              <Image
                                src={post.user.avatar_url}
                                alt={post.user?.display_name || post.user?.username || 'User'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              (post.user?.display_name || post.user?.username || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-foreground truncate">
                              {post.user?.display_name || post.user?.username || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Content */}
                        {post.content && (
                          <p className="px-4 pb-3 text-sm text-foreground/90 whitespace-pre-wrap">{post.content}</p>
                        )}

                        {/* Media */}
                        {post.media?.[0]?.url && (
                          <div className="relative w-full aspect-video bg-muted overflow-hidden">
                            <Image
                              src={post.media[0].url}
                              alt={post.content?.slice(0, 60) || 'Post media'}
                              fill
                              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Engagement */}
                        <div className="px-4 py-3 flex items-center justify-between text-xs text-muted-foreground border-b border-border/50">
                          <span className="inline-flex items-center gap-1.5">
                            <Heart className="w-4 h-4 fill-[#5a8c5a] text-[#5a8c5a] dark:fill-primary dark:text-primary" />
                            {post.likes?.length || post.analytics?.likes_count || 0}
                          </span>
                          <span>
                            {post.comments?.length || post.analytics?.comments_count || 0} Comments
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex divide-x divide-border/50">
                          <button
                            type="button"
                            className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#5a8c5a] dark:hover:text-primary hover:bg-muted/50 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            Like
                          </button>
                          <button
                            type="button"
                            className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#5a8c5a] dark:hover:text-primary hover:bg-muted/50 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Comment
                          </button>
                          <button
                            type="button"
                            className="flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#5a8c5a] dark:hover:text-primary hover:bg-muted/50 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {isContentLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-[#5a8c5a] dark:text-primary" />
                  </div>
                ) : userItems.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="font-bold uppercase tracking-wider text-sm">No products yet</p>
                    <p className="text-sm mt-1">This creator hasn't listed anything.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userItems.map((item) => (
                      <Link
                        key={item._id}
                        href={`/items/${item._id}`}
                        className="bg-card border border-border rounded-2xl overflow-hidden hover:border-[#5a8c5a] dark:hover:border-primary transition-colors group"
                      >
                        <div className="relative aspect-square w-full bg-muted overflow-hidden">
                          {item.media?.[0]?.url ? (
                            <Image
                              src={item.media[0].url}
                              alt={item.title || 'Item'}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#5a8c5a]/20 dark:from-primary/20 to-[#5a8c5a]/5 dark:to-primary/5">
                              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-foreground mb-1 line-clamp-1">{item.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-[#5a8c5a] dark:text-primary font-bold">
                              ${Number(item.price || 0).toFixed(2)}
                            </span>
                            {item.category && (
                              <span className="text-xs text-muted-foreground capitalize">{item.category}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            <span>{(Number(item.rating) || 0).toFixed(1)}</span>
                            <span>·</span>
                            <span>{item.sales || 0} sales</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
