'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { Loader2, Heart, MessageSquare, UserPlus, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Post {
  id: string
  content: string
  media: { url: string }[]
  analytics: { likes_count: number; comments_count: number }
  user?: { avatar_url: string; display_name: string; username: string }
}

interface Profile {
  id: string
  name: string
  username: string
  avatar: string
  banner: string
  bio: string
  followers: number
  following: number
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const userId = params?.userId as string

  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [portfolioPosts, setPortfolioPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'portfolio' | 'about'>('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const isOwnProfile = session?.user?.id === userId

  useEffect(() => {
    if (userId) {
      loadProfile()
    }
  }, [userId])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/users/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data.user)
        setIsFollowing(data.isFollowing || false)

        // Fetch user posts
        const postsRes = await fetch(`/api/users/${userId}/content`)
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          setUserPosts(postsData.posts || [])
        }

        // Fetch portfolio posts (same endpoint for now)
        const portfolioRes = await fetch(`/api/users/${userId}/content`)
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json()
          setPortfolioPosts(portfolioData.posts || [])
        }
      } else if (res.status === 404) {
        router.push('/feed')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      setIsFollowLoading(true)
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`/api/users/${userId}/follow`, { method })

      if (res.ok) {
        const data = await res.json()
        setIsFollowing(data.isFollowing)
        setProfile(prev =>
          prev ? {
            ...prev,
            followers: prev.followers + (data.isFollowing ? 1 : -1),
          } : null
        )
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

  return (
    <AuthenticatedLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="-mx-6 md:-mx-8 -mt-6 md:-mt-8"
        >
          <div className="relative h-80 md:h-96 overflow-hidden bg-gradient-to-br from-[#5a8c5a]/30 to-primary/20">
            {profile?.banner ? (
              <Image
                src={profile.banner}
                alt="banner"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#5a8c5a]/20 to-primary/10" />
            )}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
            {/* Left: Avatar and Info */}
            <div className="flex gap-6">
              <div className="relative w-24 h-24 rounded-full border-4 border-primary bg-muted flex-shrink-0 overflow-hidden">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/50 flex items-center justify-center text-3xl font-bold text-white">
                    {profile?.name?.charAt(0) || ''}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-black italic font-serif text-[#5a8c5a] dark:text-primary">
                  {profile?.name}
                </h1>
                <p className="text-sm text-muted-foreground">@{profile?.username}</p>
                {profile?.bio && (
                  <p className="text-sm text-foreground/80 mt-2 max-w-lg">{profile.bio}</p>
                )}

                <div className="flex gap-8 mt-4">
                  <div>
                    <p className="font-black text-[#5a8c5a] dark:text-primary">{profile?.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-black text-[#5a8c5a] dark:text-primary">{profile?.following}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Follow/Message Buttons */}
            {!isOwnProfile && (
              <div className="flex gap-2">
                <Button
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                  className={isFollowing
                    ? 'rounded-full border-2 border-[#5a8c5a] dark:border-primary text-[#5a8c5a] dark:text-primary bg-transparent hover:bg-[#5a8c5a]/10'
                    : 'rounded-full bg-gradient-to-r from-[#5a8c5a] to-[#4a7c4a] dark:from-primary text-white'
                  }
                >
                  {isFollowLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
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
                <Button variant="outline" className="rounded-full">
                  Message
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs and Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Tabs */}
          <div className="flex gap-12 border-b border-border mb-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 font-bold uppercase text-sm tracking-wider transition-colors ${
                activeTab === 'posts'
                  ? 'text-[#5a8c5a] dark:text-primary border-b-2 border-[#5a8c5a] dark:border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-4 font-bold uppercase text-sm tracking-wider transition-colors ${
                activeTab === 'portfolio'
                  ? 'text-[#5a8c5a] dark:text-primary border-b-2 border-[#5a8c5a] dark:border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 font-bold uppercase text-sm tracking-wider transition-colors ${
                activeTab === 'about'
                  ? 'text-[#5a8c5a] dark:text-primary border-b-2 border-[#5a8c5a] dark:border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              About
            </button>
          </div>

          {/* Posts Tab - Feed Style */}
          {activeTab === 'posts' && (
            <div className="space-y-6 pb-16 flex justify-center">
              <div className="w-full max-w-2xl space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map(post => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      {/* Post Image if available */}
                      {post.media?.[0]?.url && (
                        <div className="relative h-64 overflow-hidden bg-muted">
                          <Image
                            src={post.media[0].url}
                            alt={post.content}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Post Content */}
                      <div className="p-4">
                        <p className="text-foreground text-sm leading-relaxed mb-4">{post.content}</p>
                        <div className="flex gap-6 text-muted-foreground text-sm pt-2 border-t border-border/50">
                          <span className="flex items-center gap-2 hover:text-foreground cursor-pointer"><Heart className="w-4 h-4" /> {post.analytics.likes_count}</span>
                          <span className="flex items-center gap-2 hover:text-foreground cursor-pointer"><MessageSquare className="w-4 h-4" /> {post.analytics.comments_count}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">No posts yet</div>
                )}
              </div>
            </div>
          )}

          {/* Portfolio Tab - 3 Column Grid */}
          {activeTab === 'portfolio' && (
            <div className="pb-16">
              {portfolioPosts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {portfolioPosts.map(post => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative rounded-2xl overflow-hidden bg-muted cursor-pointer"
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      <div className="relative aspect-square">
                        {post.media?.[0]?.url ? (
                          <Image
                            src={post.media[0].url}
                            alt={post.content}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground text-center px-4">{post.content.slice(0, 30)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <div className="flex gap-4 text-white text-sm">
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.analytics.likes_count}</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {post.analytics.comments_count}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">No portfolio items yet</div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="pb-16 max-w-2xl">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                {profile?.bio ? (
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                ) : (
                  <p className="text-muted-foreground">No bio added yet</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AuthenticatedLayout>
  )
}
