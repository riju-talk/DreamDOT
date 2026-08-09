import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { sendNotification } from '@/lib/notifications'

/**
 * GET /api/users/[id]/follow
 * Check if current user follows this user (social schema)
 */
export async function GET(_req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (userId === session.user.id) {
      return NextResponse.json({ isFollowing: false })
    }

    const follow = await prismaSocial.following.findUnique({
      where: {
        follower_id_followee_id: {
          follower_id: session.user.id,
          followee_id: userId,
        },
      },
    })

    return NextResponse.json({ isFollowing: !!follow })
  } catch (error) {
    console.error('[API] Error checking follow status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/users/[id]/follow
 * Follow user (social schema)
 */
export async function POST(_req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    await prismaSocial.following.upsert({
      where: {
        follower_id_followee_id: {
          follower_id: session.user.id,
          followee_id: userId,
        },
      },
      update: {},
      create: {
        follower_id: session.user.id,
        followee_id: userId,
      },
    })

    // Fire-and-forget: never block or fail the follow action on a notifications-service hiccup
    sendNotification(userId, 'follow', `${session.user.name || session.user.email || 'Someone'} started following you`).catch(
      (err) => console.error('[API] Failed to dispatch follow notification:', err.message)
    )

    return NextResponse.json(
      { message: 'Followed successfully', isFollowing: true },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Error following user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/users/[id]/follow
 * Unfollow user (social schema)
 */
export async function DELETE(_req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId } = await params
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await prismaSocial.following.deleteMany({
      where: {
        follower_id: session.user.id,
        followee_id: userId,
      },
    })

    return NextResponse.json({ message: 'Unfollowed successfully', isFollowing: false })
  } catch (error) {
    console.error('[API] Error unfollowing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
