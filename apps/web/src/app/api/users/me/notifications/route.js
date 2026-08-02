import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { User } from '@repo/database-mongo'

/**
 * GET /api/users/me/notifications
 * Fetch notification preferences for current user
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
      notifications: user.notifications || {
        emailNotifications: true,
        pushNotifications: true,
        frequency: 'realtime',
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
        types: {
          newFollowers: true,
          itemPurchases: true,
          comments: true,
          messages: true,
          liveStreams: true,
        },
      },
    })
  } catch (error) {
    console.error('[API] Error fetching notification settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/users/me/notifications
 * Update notification preferences
 */
export async function PATCH(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { notifications } = body

    if (!notifications || typeof notifications !== 'object') {
      return NextResponse.json({ error: 'Invalid notification settings' }, { status: 400 })
    }

    await connectToDatabase()
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    user.notifications = {
      ...user.notifications,
      ...notifications,
    }

    await user.save()

    return NextResponse.json({
      message: 'Notification settings updated',
      notifications: user.notifications,
    })
  } catch (error) {
    console.error('[API] Error updating notification settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
