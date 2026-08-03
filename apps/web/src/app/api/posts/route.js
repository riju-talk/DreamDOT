import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/prisma/social'
import { Post } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

export async function GET(request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user by email from PostgreSQL
    const user = await prismaSocial.users.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit')) || 20))
    const filter = searchParams.get('filter') || 'for-you' // 'following', 'for-you', 'trending'
    const search = searchParams.get('search')

    // 4. Connect to MongoDB
    await connectToDatabase()

    // 5. Build MongoDB query
    let query = { visibility: true }

    // Apply filter
    if (filter === 'following') {
      // Get following list from PostgreSQL
      const following = await prismaSocial.following.findMany({
        where: { follower_id: user.id },
        select: { followee_id: true }
      })
      const followingIds = following.map(f => f.followee_id.toString())
      query.userId = { $in: followingIds }
    } else if (filter === 'trending') {
      // Filter by high engagement
      query.engagementScore = { $gte: 5 }
    }
    // 'for-you' uses all posts by default

    // Add search filter if provided
    if (search) {
      query.$text = { $search: search }
    }

    // 6. Get total count
    const total = await Post.countDocuments(query)

    // 7. Fetch posts from MongoDB
    const skip = (page - 1) * limit
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // 8. Enrich posts with user info from PostgreSQL and like counts
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        // Get creator info
        const creator = await prismaSocial.users.findMany({
          where: {
            user_profile: {
              some: {}
            }
          },
          take: 1,
          select: {
            id: true,
            user_profile: {
              select: {
                display_name: true,
                avatar_url: true,
                username: true
              }
            }
          }
        })

        // Get like count
        const likeCount = await prismaSocial.likes.count({
          where: { post_id: post._id.toString() }
        })

        // Check if current user liked
        const isLiked = await prismaSocial.likes.findFirst({
          where: {
            user_id: user.id,
            post_id: post._id.toString()
          }
        })

        // Get comment count
        const commentCount = post.comments?.length || 0

        return {
          id: post._id.toString(),
          content: post.content,
          title: post.title,
          media: post.media || [],
          createdAt: post.createdAt,
          creator: {
            id: post.userId,
            name: creator[0]?.user_profile?.[0]?.display_name || 'Unknown',
            username: creator[0]?.user_profile?.[0]?.username || 'user',
            avatar: creator[0]?.user_profile?.[0]?.avatar_url || null
          },
          engagement: {
            likes: likeCount,
            comments: commentCount,
            shares: post.shares || 0
          },
          userInteraction: {
            isLiked: !!isLiked,
            isSaved: false // TODO: implement saves
          }
        }
      })
    )

    // 9. Return response
    return NextResponse.json(
      {
        posts: enrichedPosts,
        hasMore: skip + enrichedPosts.length < total,
        total,
        page,
        limit
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
