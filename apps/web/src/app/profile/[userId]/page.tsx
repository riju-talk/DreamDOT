'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { ProfileHeader } from '@/components/profile-header'
import { ProfileTabs } from '@/components/profile-tabs'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowUpRight, Instagram, Twitter, Globe, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProfileData {
  id: string
  name: string
  avatar: string
  bio: string
  location: string
  website: string
  socialLinks: string[]
  followers: number
  following: number
  joinedAt: string
  accountStatus: string
  privacyVisibility: string
}

const MOCK_PORTFOLIO = [
  {
    id: 1,
    title: "Ethereal Landscapes",
    type: "Photography",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
  },
  {
    id: 2,
    title: "Minimal Objects",
    type: "3D Render",
    image: "https://images.unsplash.com/photo-1629814408992-06e0000a638b?q=80&w=2670&auto=format&fit=crop",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    id: 3,
    title: "Typography Studies",
    type: "Design",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    id: 4,
    title: "Organic Forms",
    type: "Art Direction",
    image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2670&auto=format&fit=crop",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1",
  },
]

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const userId = params?.userId as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [displayMode, setDisplayMode] = useState<'portfolio' | 'profile'>('profile')

  // Check if this is the user's own profile
  const isOwnProfile = session?.user?.id === userId

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

        // Check follow status if not own profile
        if (!isOwnProfile && session?.user?.id) {
          const followRes = await fetch(`/api/users/${userId}/follow`)
          if (followRes.ok) {
            const followData = await followRes.json()
            setIsFollowing(followData.isFollowing)
          }
        }
      } catch (error) {
        console.error('[Profile] Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      loadProfile()
    }
  }, [userId, session?.user?.id, isOwnProfile])

  const handleFollowClick = async () => {
    try {
      setIsFollowLoading(true)
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`/api/users/${userId}/follow`, { method })

      if (res.ok) {
        const data = await res.json()
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error('[Profile] Error toggling follow:', error)
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-[#99FF33]" />
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!profile) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-12">
          <p className="text-[#6B8E6E]">Profile not found</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  // Portfolio view mode (for public viewing or gallery display)
  if (displayMode === 'portfolio') {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#0A0F0D] font-sans selection:bg-[#556B2F] selection:text-white pb-32">
        {/* Analog Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-multiply"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* Top Navigation (Minimal) */}
        <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center mix-blend-difference text-[#FAFAF9]">
          <button onClick={() => setDisplayMode('profile')} >
            <Button variant="ghost" size="icon" className="group rounded-full hover:bg-white/10 text-[#0A0F0D]">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </button>
          <span className="text-xs font-mono tracking-widest uppercase opacity-60 text-[#0A0F0D]">DreamDOT Portfolio</span>
        </nav>

        {/* Hero Cover */}
        <header className="relative w-full h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              alt="Cover"
              className="w-full h-full object-cover grayscale-[20%] contrast-[95%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAFAF9]" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-serif tracking-tighter text-[#0A0F0D]"
              >
                {profile.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl font-light text-[#0A0F0D]/70 max-w-xl"
              >
                {profile.bio || "Digital Artist & Visual Storyteller. Exploring the intersection of nature and technology."}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <SocialLink icon={Instagram} />
              <SocialLink icon={Twitter} />
              <SocialLink icon={Globe} />
            </motion.div>
          </div>
        </header>

        {/* Bento Grid Content */}
        <main className="relative z-10 px-4 md:px-12 py-12 max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_PORTFOLIO.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "group relative bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_80px_-20px_rgba(85,107,47,0.15)] transition-all duration-700",
                  item.colSpan,
                  item.rowSpan
                )}
              >
                {/* Image Container */}
                <div className="flex h-full min-h-[400px] w-full relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#0A0F0D]/0 group-hover:bg-[#0A0F0D]/10 transition-colors duration-500" />

                  {/* Floating Info */}
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl flex justify-between items-center shadow-lg">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-[#556B2F] mb-1">{item.type}</p>
                        <h3 className="text-2xl font-serif text-[#0A0F0D]">{item.title}</h3>
                      </div>
                      <div className="bg-[#556B2F] text-white p-3 rounded-full">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Floating Nav Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="flex items-center gap-2 bg-[#0A0F0D]/90 backdrop-blur-2xl text-[#FAFAF9] p-2 pl-6 pr-2 rounded-full border border-white/10 shadow-2xl"
          >
            <span className="text-sm font-medium mr-4">Get in touch</span>
            <Button size="sm" className="rounded-full bg-[#FAFAF9] text-[#0A0F0D] hover:bg-[#FAFAF9]/90 px-6 font-medium">
              Book Now
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Standard profile view
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Profile Header with Actions */}
        <div className="relative mb-8">
          <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-[#1a1918]">
            {/* Banner */}
          </div>

          {/* Profile Card */}
          <div className="bg-[#121412] border border-[#2a2826] rounded-2xl -mt-16 mx-4 relative z-10 p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-[#99FF33] flex items-center justify-center text-[#121412] text-4xl font-bold border-4 border-[#121412] flex-shrink-0">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="text-center md:text-left md:mb-2">
                  <h1 className="text-3xl font-bold text-[#FFFFFF]">{profile.name}</h1>
                  <p className="text-[#6B8E6E] text-lg mb-3">@{profile.id.slice(0, 8)}</p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[#6B8E6E] mb-4">
                    {profile.location && <span>{profile.location}</span>}
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[#99FF33] hover:underline">
                        {profile.website}
                      </a>
                    )}
                  </div>

                  <p className="max-w-2xl text-[#FFFFFF]">{profile.bio || 'No bio yet'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 items-center md:justify-end mb-2">
                {!isOwnProfile && (
                  <Button
                    onClick={handleFollowClick}
                    disabled={isFollowLoading}
                    className={isFollowing ? 'bg-[#2a2826] text-[#99FF33] border border-[#99FF33]' : 'bg-[#99FF33] text-[#121412]'}
                  >
                    {isFollowLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}

                {isOwnProfile && (
                  <Button variant="outline" onClick={() => router.push('/settings')} className="border-[#99FF33]">
                    Edit Profile
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => setDisplayMode('portfolio')}
                  className="border-[#99FF33] text-[#99FF33]"
                >
                  View Portfolio
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start space-x-8 text-center mt-6 pt-6 border-t border-[#2a2826]">
              <div>
                <div className="text-2xl text-[#99FF33] font-bold">{profile.followers}</div>
                <div className="text-sm text-[#6B8E6E]">Followers</div>
              </div>
              <div>
                <div className="text-2xl text-[#99FF33] font-bold">{profile.following}</div>
                <div className="text-sm text-[#6B8E6E]">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <ProfileTabs isOwnProfile={isOwnProfile} userId={userId} />
      </div>
    </AuthenticatedLayout>
  )
}

function SocialLink({ icon: Icon }: { icon: any }) {
  return (
    <Button variant="outline" size="icon" className="rounded-full border-[#0A0F0D]/10 hover:bg-[#0A0F0D] hover:text-[#FAFAF9] transition-colors duration-300 w-12 h-12">
      <Icon className="w-5 h-5" />
    </Button>
  )
}
