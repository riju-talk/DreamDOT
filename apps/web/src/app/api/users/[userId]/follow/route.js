import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { User } from '@repo/database-mongo'

/**
 * GET /api/users/[userId]/follow
 * Check if current user follows this user
 */
export async function GET(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await connectToDatabase()
    const currentUser = await User.findById(session.user.id).lean()

    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 })
    }

    const isFollowing = (currentUser.following || []).includes(userId)

    return NextResponse.json({ isFollowing })
  } catch (error) {
    console.error('[API] Error checking follow status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/users/[userId]/follow
 * Follow user
 */
export async function POST(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    await connectToDatabase()

    const targetUser = await User.findById(userId)
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentUser = await User.findById(session.user.id)
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 })
    }

    // Add to following list
    if (!currentUser.following) currentUser.following = []
    if (!currentUser.following.includes(userId)) {
      currentUser.following.push(userId)
    }

    // Add to followers list
    if (!targetUser.followers) targetUser.followers = []
    if (!targetUser.followers.includes(session.user.id)) {
      targetUser.followers.push(session.user.id)
    }

    await currentUser.save()
    await targetUser.save()

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
 * DELETE /api/users/[userId]/follow
 * Unfollow user
 */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await connectToDatabase()

    const targetUser = await User.findById(userId)
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentUser = await User.findById(session.user.id)
    if (!currentUser) {
      return NextResponse.json({ error: 'Current user not found' }, { status: 404 })
    }

    // Remove from following list
    if (currentUser.following) {
      currentUser.following = currentUser.following.filter((id) => id !== userId)
    }

    // Remove from followers list
    if (targetUser.followers) {
      targetUser.followers = targetUser.followers.filter((id) => id !== session.user.id)
    }

    await currentUser.save()
    await targetUser.save()

    return NextResponse.json({ message: 'Unfollowed successfully', isFollowing: false })
  } catch (error) {
    console.error('[API] Error unfollowing user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
