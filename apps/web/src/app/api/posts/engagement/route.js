import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

/**
 * GET /api/posts/engagement
 * Get engagement data (likes, saves, shares) for multiple posts
 * Query params:
 *  - postIds: comma-separated post IDs
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
      return NextResponse.json({ engagement: {} }, { status: 200 })
    }

    // Get share counts for all posts
    const shareCounts = await prisma.shares.groupBy({
      by: ['post_id'],
      where: {
        post_id: { in: postIds },
      },
      _count: true,
    })

    // Get save counts for all posts
    const saveCounts = await prisma.saves.groupBy({
      by: ['post_id'],
      where: {
        post_id: { in: postIds },
      },
      _count: true,
    })

    // Build count maps
    const shareCountMap = {}
    shareCounts.forEach(item => {
      shareCountMap[item.post_id] = item._count
    })

    const saveCountMap = {}
    saveCounts.forEach(item => {
      saveCountMap[item.post_id] = item._count
    })

    // Get user's saves/shares if authenticated
    const userSaves = {}
    const userShares = {}

    if (session?.user?.email) {
      const user = await prisma.users.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        const userSavedPosts = await prisma.saves.findMany({
          where: {
            user_id: user.id,
            post_id: { in: postIds },
          },
          select: { post_id: true },
        })

        const userSharedPosts = await prisma.shares.findMany({
          where: {
            user_id: user.id,
            post_id: { in: postIds },
          },
          select: { post_id: true },
        })

        userSavedPosts.forEach(save => {
          userSaves[save.post_id] = true
        })

        userSharedPosts.forEach(share => {
          userShares[share.post_id] = true
        })
      }
    }

    // Build response
    const engagement = {}
    postIds.forEach(postId => {
      engagement[postId] = {
        saves: {
          count: saveCountMap[postId] || 0,
          saved: userSaves[postId] || false,
        },
        shares: {
          count: shareCountMap[postId] || 0,
          shared: userShares[postId] || false,
        },
      }
    })

    console.log(`✅ Fetched engagement for ${postIds.length} posts`)

    return NextResponse.json({ engagement }, { status: 200 })
  } catch (error) {
    console.error('Error fetching engagement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch engagement data' },
      { status: 500 }
    )
  }
}
