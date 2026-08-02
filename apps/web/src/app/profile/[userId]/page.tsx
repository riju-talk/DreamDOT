'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AuthenticatedLayout } from '@/components/authenticated-layout'
import { ProfileHeader } from '@/components/profile-header'
import { ProfileTabs } from '@/components/profile-tabs'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

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

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const userId = params?.userId as string

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

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
              {!isOwnProfile && (
                <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
                  <Button
                    onClick={handleFollowClick}
                    disabled={isFollowLoading}
                    className={isFollowing ? 'bg-[#2a2826] text-[#99FF33] border border-[#99FF33]' : 'bg-[#99FF33] text-[#121412]'}
                  >
                    {isFollowLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              )}

              {isOwnProfile && (
                <Button variant="outline" onClick={() => router.push('/settings')} className="border-[#99FF33]">
                  Edit Profile
                </Button>
              )}
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
