import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

/**
 * GET /api/posts/likes
 * Get like information for posts
 * Query params:
 *  - postIds: comma-separated post IDs to fetch likes for
 */
export async function GET(request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const postIdsParam = searchParams.get('postIds')

    if (!postIdsParam) {
      return NextResponse.json(
        { error: 'postIds parameter is required' },
        { status: 400 }
      )
    }

    const postIds = postIdsParam.split(',').filter(id => id.trim())

    if (postIds.length === 0) {
      return NextResponse.json({ likes: {} }, { status: 200 })
    }

    // Get like counts for all posts
    const likeCounts = await prisma.likes.groupBy({
      by: ['post_id'],
      where: {
        post_id: { in: postIds },
      },
      _count: true,
    })

    // Build a map of post_id to like count
    const likeCountMap = {}
    likeCounts.forEach(item => {
      likeCountMap[item.post_id] = item._count
    })

    // Get user's likes if authenticated
    const userLikes = {}
    if (session?.user?.email) {
      const user = await prisma.users.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        const userLikedPosts = await prisma.likes.findMany({
          where: {
            user_id: user.id,
            post_id: { in: postIds },
          },
          select: { post_id: true },
        })

        userLikedPosts.forEach(like => {
          userLikes[like.post_id] = true
        })
      }
    }

    // Build response with likes for each post
    const likes = {}
    postIds.forEach(postId => {
      likes[postId] = {
        count: likeCountMap[postId] || 0,
        liked: userLikes[postId] || false,
      }
    })

    console.log(`✅ Fetched likes for ${postIds.length} posts`)

    return NextResponse.json({ likes }, { status: 200 })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}
