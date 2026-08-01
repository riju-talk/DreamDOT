import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

/**
 * GET /api/posts/feed
 * Get feed posts based on user's follows, with optional filters
 * Query params:
 *  - filter: 'following' | 'for-you' | 'trending' (default: 'for-you')
 *  - page: page number (default: 1)
 *  - limit: posts per page (default: 10)
 *  - search: search term (optional)
 */
export async function GET(request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const filter = searchParams.get('filter') || 'for-you'
    const search = searchParams.get('search') || ''

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    let query = { visibility: true }

    // For 'following' filter, only show posts from users being followed
    if (filter === 'following' && session?.user?.email) {
      const user = await prisma.users.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        // Get list of users being followed
        const following = await prisma.following.findMany({
          where: { follower_id: user.id },
          select: { followee_id: true },
        })

        const followeeIds = following.map(f => f.followee_id)

        // Include own posts + followed users' posts
        query = {
          AND: [
            { visibility: true },
            {
              OR: [
                { user_id: user.id },
                { user_id: { in: followeeIds } },
              ]
            }
          ]
        }
      }
    }

    // Apply search filter
    if (search.trim()) {
      const searchRegex = search.trim()
      query = {
        AND: [
          query,
          {
            OR: [
              {
                posts_analytics: {
                  posts_metadata: {
                    description: {
                      search: searchRegex,
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }

    // Get total count
    const total = await prisma.posts_metadata.count({ where: query })

    // Determine sort order
    let orderBy = { created_at: 'desc' }
    if (filter === 'trending') {
      // Sort by likes (from posts_analytics)
      orderBy = [
        { posts_analytics: { likes_count: 'desc' } },
        { created_at: 'desc' }
      ]
    }

    // Query posts with pagination
    const posts = await prisma.posts_metadata.findMany({
      where: query,
      include: {
        users: {
          select: { id: true, email: true }
        },
        posts_analytics: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    // Format response
    const formattedPosts = posts.map(post => ({
      id: post.id,
      userId: post.user_id,
      description: post.description,
      visibility: post.visibility,
      createdAt: post.created_at,
      likes: post.posts_analytics?.likes_count || 0,
      comments: post.posts_analytics?.comments_count || 0,
      author: {
        id: post.users.id,
        email: post.users.email,
      }
    }))

    console.log(`✅ Fetched ${formattedPosts.length} feed posts (filter: ${filter})`)

    return NextResponse.json(
      {
        posts: formattedPosts,
        hasMore: (page - 1) * limit + limit < total,
        total,
        page,
        limit,
        filter,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    )
  }
}
