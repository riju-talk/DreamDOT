import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { User } from '@repo/database-mongo'

/**
 * GET /api/users/[userId]
 * Fetch public user profile
 */
export async function GET(req, { params }) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    await connectToDatabase()
    const user = await User.findById(userId).lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return public profile data
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        socialLinks: user.socialLinks || [],
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
        joinedAt: user.createdAt,
        accountStatus: user.accountStatus,
        privacyVisibility: user.privacy?.profileVisibility,
      },
    })
  } catch (error) {
    console.error('[API] Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
