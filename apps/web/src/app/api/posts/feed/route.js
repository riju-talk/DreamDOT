import { NextResponse } from 'next/server'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaItems } from '@/lib/prisma/items'

/**
 * GET /api/posts/feed
 * Main feed - randomized posts and items with lazy loading
 * Query params:
 *  - page: page number (default: 1)
 *  - limit: items per page (default: 10, max 50)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '10', 10)), 50)
    const offset = (page - 1) * limit

    let feed = []

    // Fetch all visible posts
    const allPosts = await prismaSocial.posts.findMany({
      where: { visibility: true },
      include: {
        users: {
          select: { id: true, email: true }
        },
        posts_analytics: true,
      },
    })

      // Format posts
      const formattedPosts = allPosts.map(post => ({
        id: post.id,
        type: 'post',
        userId: post.user_id,
        content: post.content,
        visibility: post.visibility,
        createdAt: post.created_at,
        likes: post.posts_analytics?.likes_count ? Array(post.posts_analytics.likes_count).fill('') : [],
        comments: [],
        author: {
          id: post.users.id,
          email: post.users.email,
          name: post.users.email?.split('@')[0] || 'User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
          verified: false,
        }
      }))

    feed.push(...formattedPosts)

    // Fetch all public items
    const allItems = await prismaItems.items.findMany({
      where: { visibility: 'public' },
      include: {
        users: {
          select: { id: true }
        },
      },
    })

    // Format items
    const formattedItems = allItems.map(item => ({
      id: item.item_id,
      type: 'item',
      userId: item.user_id,
      title: item.title,
      description: item.description,
      category: item.category || 'general',
      price: parseFloat(item.price?.toString() || '0'),
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop',
      rating: Math.floor(Math.random() * 5),
      sales: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 1000),
      visibility: item.visibility,
      createdAt: item.created_at,
      creator: {
        id: item.users.id,
        name: `Creator ${item.users.id?.slice(0, 4)}`,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        verified: false,
      }
    }))

    feed.push(...formattedItems)

    // Shuffle entire feed randomly
    feed = shuffleArray(feed)

    const total = feed.length

    // Apply lazy loading with offset and limit
    const paginatedFeed = feed.slice(offset, offset + limit)

    return NextResponse.json(
      {
        posts: paginatedFeed,
        hasMore: offset + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching feed:', error)

    return NextResponse.json(
      { posts: [], hasMore: false },
      { status: 500 }
    )
  }
}

/**
 * Fisher-Yates shuffle algorithm for randomization
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
