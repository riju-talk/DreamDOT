import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { User } from '@repo/database-mongo'

/**
 * GET /api/users/me/privacy
 * Fetch privacy settings for current user
 */
export async function GET(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findById(session.user.id).lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      privacy: user.privacy || {
        profileVisibility: 'public',
        showEmail: false,
        allowMessages: true,
        allowNotifications: true,
        showOnlineStatus: true,
        showActivityStatus: true,
      },
      blockedUsers: user.blockedUsers || [],
    })
  } catch (error) {
    console.error('[API] Error fetching privacy settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/users/me/privacy
 * Update privacy settings
 */
export async function PATCH(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { privacy } = body

    if (!privacy || typeof privacy !== 'object') {
      return NextResponse.json({ error: 'Invalid privacy settings' }, { status: 400 })
    }

    await connectToDatabase()
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update privacy settings
    user.privacy = {
      ...user.privacy,
      ...privacy,
    }

    await user.save()

    return NextResponse.json({
      message: 'Privacy settings updated',
      privacy: user.privacy,
    })
  } catch (error) {
    console.error('[API] Error updating privacy settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
