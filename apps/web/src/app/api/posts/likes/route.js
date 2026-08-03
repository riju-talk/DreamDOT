import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'
import { hydratePosts } from '@/lib/mongoose/posts'

/**
 * GET /api/posts/likes
 *
 * Modes:
 *  - `?postIds=a,b,c`  → lightweight like state for arbitrary posts
 *  - `?mine=true`      → full list of posts the current user has liked
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const mine = searchParams.get('mine') === 'true'

    // ---------- Full liked-posts list for the current user ----------
    if (mine) {
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prismaUser.users.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const page = parseInt(searchParams.get('page') || '1', 10)
      const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)
      const skip = (page - 1) * limit

      const total = await prismaSocial.likes.count({
        where: { user_id: user.id },
      })

      const likes = await prismaSocial.likes.findMany({
        where: { user_id: user.id },
        orderBy: { liked_at: 'desc' },
        skip,
        take: limit,
        include: {
          posts: {
            include: { posts_analytics: true },
          },
        },
      })

      const hydrated = await hydratePosts(likes.map((l) => l.posts))
      const posts = hydrated.map((post, idx) => ({
        ...post,
        liked: true,
        likedAt: likes[idx]?.liked_at ?? null,
      }))

      return NextResponse.json(
        {
          posts,
          total,
          page,
          limit,
          hasMore: skip + posts.length < total,
        },
        { status: 200 }
      )
    }

    // ---------- Like state for a batch of post ids ----------
    const postIdsParam = searchParams.get('postIds')

    if (!postIdsParam) {
      return NextResponse.json(
        { error: 'postIds parameter is required (or use ?mine=true)' },
        { status: 400 }
      )
    }

    const postIds = postIdsParam.split(',').filter((id) => id.trim())

    if (postIds.length === 0) {
      return NextResponse.json({ likes: {} }, { status: 200 })
    }

    const likeCounts = await prismaSocial.likes.groupBy({
      by: ['post_id'],
      where: {
        post_id: { in: postIds },
      },
      _count: true,
    })

    const likeCountMap = {}
    likeCounts.forEach((item) => {
      likeCountMap[item.post_id] = item._count
    })

    const userLikes = {}
    if (session?.user?.email) {
      const user = await prismaUser.users.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
      if (user) {
        const userLikedPosts = await prismaSocial.likes.findMany({
          where: {
            user_id: user.id,
            post_id: { in: postIds },
          },
          select: { post_id: true },
        })
        userLikedPosts.forEach((like) => {
          userLikes[like.post_id] = true
        })
      }
    }

    const likes = {}
    postIds.forEach((postId) => {
      likes[postId] = {
        count: likeCountMap[postId] || 0,
        liked: userLikes[postId] || false,
      }
    })

    return NextResponse.json({ likes }, { status: 200 })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}