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
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'saves'>('posts')
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

        // Fetch liked posts
        const likesRes = await fetch(`/api/users/${userId}/likes`)
        if (likesRes.ok) {
          const likesData = await likesRes.json()
          setLikedPosts(likesData.posts || [])
        }

        // Fetch saved posts
        const savesRes = await fetch(`/api/users/${userId}/saves`)
        if (savesRes.ok) {
          const savesData = await savesRes.json()
          setSavedPosts(savesData.posts || [])
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
        className="space-y-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Full-width Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-56 md:h-72 -mx-6 mb-0"
        >
          <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#5a8c5a]/30 to-primary/20">
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

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 md:px-6 -mt-20 relative z-10 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            {/* Avatar */}
            <div className="relative w-40 h-40 rounded-2xl border-4 border-card bg-muted flex-shrink-0 overflow-hidden shadow-lg">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/50 flex items-center justify-center text-5xl font-bold text-white">
                  {profile?.name?.charAt(0) || ''}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black italic font-serif text-[#5a8c5a] dark:text-primary">
                {profile?.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">@{profile?.username}</p>
              {profile?.bio && (
                <p className="text-sm text-foreground/80 mt-3 max-w-2xl">{profile.bio}</p>
              )}

              {/* Stats Row */}
              <div className="flex gap-8 mt-6">
                <div>
                  <p className="text-2xl font-black text-[#5a8c5a] dark:text-primary">{profile?.followers}</p>
                  <p className="text-xs uppercase font-bold text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#5a8c5a] dark:text-primary">{profile?.following}</p>
                  <p className="text-xs uppercase font-bold text-muted-foreground">Following</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#5a8c5a] dark:text-primary">{likedPosts.length}</p>
                  <p className="text-xs uppercase font-bold text-muted-foreground">Likes</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#5a8c5a] dark:text-primary">{savedPosts.length}</p>
                  <p className="text-xs uppercase font-bold text-muted-foreground">Saves</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Button className="rounded-full bg-gradient-to-r from-[#5a8c5a] to-[#4a7c4a] dark:from-primary text-white">
                  Edit Profile
                </Button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto px-4 md:px-6"
        >
          <div className="flex gap-8 border-b border-border mb-8">
            {['posts', 'likes', 'saves'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 font-bold uppercase text-xs tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'text-[#5a8c5a] dark:text-primary border-b-2 border-[#5a8c5a] dark:border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="pb-16">
              {userPosts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {userPosts.map(post => (
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
                <div className="text-center py-16 text-muted-foreground">No posts yet</div>
              )}
            </div>
          )}

          {/* Likes Tab */}
          {activeTab === 'likes' && (
            <div className="pb-16">
              {likedPosts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {likedPosts.map(post => (
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
                <div className="text-center py-16 text-muted-foreground">No liked posts yet</div>
              )}
            </div>
          )}

          {/* Saves Tab */}
          {activeTab === 'saves' && (
            <div className="pb-16">
              {savedPosts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {savedPosts.map(post => (
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
                <div className="text-center py-16 text-muted-foreground">No saved posts yet</div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AuthenticatedLayout>
  )
}
