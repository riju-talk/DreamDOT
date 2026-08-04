import { NextResponse } from 'next/server'
import { fetchPosts } from '@/lib/mongoose/posts'
import { fetchItems } from '@/lib/mongoose/items'
import { prismaUser } from '@/lib/prisma/user'

const FALLBACK_IMAGE = 'https://i0.wp.com/www.innovationyourself.com/wp-content/uploads/2020/08/simplifying-controllers-action-fallback.png?fit=700%2C400&ssl=1'

/**
 * GET /api/posts/feed
 * Fetch real posts and items from database (PostgreSQL + MongoDB)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch posts from PostgreSQL + MongoDB
    const postsResult = await fetchPosts({ page, limit })
    const itemsResult = await fetchItems({ page, limit })

    // Enrich posts with user data
    let enrichedPosts = postsResult.posts
    if (enrichedPosts.length > 0) {
      const userIds = [...new Set(enrichedPosts.map(p => p.userId).filter(Boolean))]
      if (userIds.length > 0) {
        const users = await prismaUser.users.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            is_verified: true,
            user_profile: {
              select: {
                display_name: true,
                avatar_url: true,
              },
            },
          },
        })

        const userMap = new Map(users.map(u => [u.id, u]))

        enrichedPosts = enrichedPosts.map(post => {
          const userData = userMap.get(post.userId)
          return {
            ...post,
            author: {
              id: post.userId,
              name: userData?.user_profile?.display_name || 'User',
              avatar: userData?.user_profile?.avatar_url || FALLBACK_IMAGE,
              verified: userData?.is_verified || false,
            },
            user: {
              id: post.userId,
              display_name: userData?.user_profile?.display_name || 'User',
              username: userData?.user_profile?.display_name || 'user',
              avatar_url: userData?.user_profile?.avatar_url || FALLBACK_IMAGE,
              verified: userData?.is_verified || false,
            },
          }
        })
      }
    }

    // Enrich items with user data
    let enrichedItems = itemsResult.items
    if (enrichedItems.length > 0) {
      const userIds = [...new Set(enrichedItems.map(i => i.userId).filter(Boolean))]
      if (userIds.length > 0) {
        const users = await prismaUser.users.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            is_verified: true,
            user_profile: {
              select: {
                display_name: true,
                avatar_url: true,
              },
            },
          },
        })

        const userMap = new Map(users.map(u => [u.id, u]))

        enrichedItems = enrichedItems.map(item => ({
          ...item,
          id: item.sqlId || String(item._id),
          creator: {
            name: userMap.get(item.userId)?.user_profile?.display_name || 'Creator',
            avatar: userMap.get(item.userId)?.user_profile?.avatar_url || FALLBACK_IMAGE,
            verified: userMap.get(item.userId)?.is_verified || false,
          },
          image: item.media?.[0]?.url || FALLBACK_IMAGE,
        }))
      }
    }

    // Merge posts and items into single feed, newest first
    const feed = [
      ...enrichedPosts.map(p => ({ ...p, type: 'post' })),
      ...enrichedItems.map(i => ({ ...i, type: 'item' })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(
      {
        feed,
        posts: enrichedPosts,
        items: enrichedItems,
        pagination: {
          total: (postsResult.pagination?.total || 0) + (itemsResult.pagination?.total || 0),
          page,
          limit,
          hasMore: (postsResult.pagination?.hasMore || false) || (itemsResult.pagination?.hasMore || false),
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error fetching feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feed', details: error.message },
      { status: 500 }
    )
  }
}
