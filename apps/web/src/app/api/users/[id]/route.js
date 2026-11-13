import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaUser } from '@/lib/prisma/user'
import { prismaSocial } from '@/lib/prisma/social'

export async function GET(_request, { params }) {
  try {
    const { id: userId } = await params

    const user = await prismaUser.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            avatar_url: true,
            banner_url: true,
            bio: true,
            country: true,
            website: true,
            social_links: true,
          },
        },
        created_at: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Follower/following counts from the social schema
    const followerCount = await prismaSocial.following.count({
      where: { followee_id: userId },
    })

    const followingCount = await prismaSocial.following.count({
      where: { follower_id: userId },
    })

    // Check if current user is following this user
    const session = await getServerSession(authOptions)
    let isFollowing = false

    if (session?.user?.id && session.user.id !== userId) {
      const follow = await prismaSocial.following.findUnique({
        where: {
          follower_id_followee_id: {
            follower_id: session.user.id,
            followee_id: userId,
          },
        },
      })
      isFollowing = !!follow
    }

    const p = user.user_profile

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: p?.display_name || p?.username || user.id.slice(0, 8),
          username: p?.username || null,
          avatar: p?.avatar_url || null,
          banner: p?.banner_url || null,
          bio: p?.bio || null,
          location: p?.country || null,
          website: p?.website || null,
          socialLinks: p?.social_links || [],
          followers: followerCount,
          following: followingCount,
          joinedAt: user.created_at,
        },
        isFollowing,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
