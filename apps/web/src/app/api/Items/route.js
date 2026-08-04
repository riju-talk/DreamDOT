import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaItems } from '@/lib/prisma/items'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

export async function GET(request) {
  try {
    // 1. Authenticate user (optional for reading)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.email ? (
      await prismaItems.users.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
    )?.id : null

    // 2. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit')) || 20))
    const category = searchParams.get('category')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'recent' // 'recent', 'price-asc', 'price-desc', 'popular'

    // 3. Connect to MongoDB
    await connectToDatabase()

    // 4. Build MongoDB query
    let query = { visibility: 'public' }

    // Add category filter
    if (category) {
      query.category = category
    }

    // Add price range filter
    if (priceMin || priceMax) {
      query.price = {}
      if (priceMin) query.price.$gte = parseFloat(priceMin)
      if (priceMax) query.price.$lte = parseFloat(priceMax)
    }

    // Add search filter
    if (search) {
      query.$text = { $search: search }
    }

    // 5. Get total count
    const total = await Item.countDocuments(query)

    // 6. Determine sort order
    let sort = { createdAt: -1 }
    if (sortBy === 'price-asc') sort = { price: 1 }
    else if (sortBy === 'price-desc') sort = { price: -1 }
    else if (sortBy === 'popular') sort = { sales: -1, rating: -1 }

    // 7. Fetch items from MongoDB
    const skip = (page - 1) * limit
    const items = await Item.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    // 8. Enrich items with creator info from PostgreSQL
    const userIds = [...new Set(items.map((item) => item.userId).filter(Boolean))]
    const users = await prismaItems.users.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        is_verified: true,
        user_profile: {
          select: {
            display_name: true,
            avatar_url: true,
            username: true
          }
        }
      }
    })
    const userMap = new Map(users.map((u) => [u.id, u]))

    // Check favorites in bulk (if authenticated)
    let favoriteItemIds = new Set()
    if (userId) {
      const sqlIds = items.map((item) => item.sqlId).filter(Boolean)
      if (sqlIds.length > 0) {
        const saved = await prismaItems.favorites.findMany({
          where: {
            user_id: userId,
            item_id: { in: sqlIds }
          },
          select: { item_id: true }
        })
        favoriteItemIds = new Set(saved.map((s) => s.item_id))
      }
    }

    const enrichedItems = items.map((item) => {
      const creator = userMap.get(item.userId)
      const publicId = item.sqlId || item._id.toString()
      return {
        id: publicId,
        title: item.title,
        description: item.description,
        category: item.category,
        price: item.price,
        image: item.media?.[0]?.url || null,
        rating: item.rating,
        reviews: item.reviews,
        sales: item.sales,
        creator: {
          id: item.userId,
          name: creator?.user_profile?.display_name || 'Unknown',
          username: creator?.user_profile?.username || 'user',
          avatar: creator?.user_profile?.avatar_url || null,
          verified: creator?.is_verified || false
        },
        userInteraction: {
          isSaved: favoriteItemIds.has(item.sqlId),
          isPurchased: false // TODO: check if user owns this
        },
        createdAt: item.createdAt
      }
    })

    // 9. Return response
    return NextResponse.json(
      {
        items: enrichedItems,
        hasMore: skip + enrichedItems.length < total,
        total,
        page,
        limit
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get items error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
