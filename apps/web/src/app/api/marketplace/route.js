import { NextResponse } from 'next/server'
import { fetchItems } from '@/lib/mongoose/items'
import { prismaUser } from '@/lib/prisma/user'

/**
 * GET /api/marketplace
 * Fetch items for marketplace with user enrichment
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch items from database
    const itemsResult = await fetchItems({ page, limit })
    let enrichedItems = itemsResult.items || []

    // Enrich items with user data
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
          creator: {
            name: userMap.get(item.userId)?.user_profile?.display_name || 'Creator',
            avatar: userMap.get(item.userId)?.user_profile?.avatar_url || '/placeholder.svg',
            verified: userMap.get(item.userId)?.is_verified || false,
          },
          image: item.media?.[0]?.url || '/placeholder.svg',
          fileUrl: item.media?.[0]?.url || '/placeholder.svg',
          creatorName: userMap.get(item.userId)?.user_profile?.display_name || 'Creator',
        }))
      }
    }

    return NextResponse.json(
      {
        items: enrichedItems,
        pagination: {
          total: itemsResult.pagination?.total || 0,
          page,
          limit,
          hasMore: itemsResult.pagination?.hasMore || false,
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error fetching marketplace items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error.message },
      { status: 500 }
    )
  }
}
