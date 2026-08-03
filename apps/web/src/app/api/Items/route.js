import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/prisma/social'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

export async function GET(request) {
  try {
    // 1. Authenticate user (optional for reading)
    const session = await getServerSession()
    const userId = session?.user?.email ? (
      await prismaSocial.users.findUnique({
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
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        // Get creator profile
        const creator = await prismaSocial.users.findMany({
          where: {
            user_profile: {
              some: {}
            }
          },
          take: 1,
          select: {
            user_profile: {
              select: {
                display_name: true,
                avatar_url: true,
                username: true
              }
            }
          }
        })

        // Check if user saved this item (if authenticated)
        let isSaved = false
        if (userId) {
          const saved = await prismaSocial.favorites.findFirst({
            where: {
              user_id: userId,
              item_id: item._id.toString()
            }
          })
          isSaved = !!saved
        }

        return {
          id: item._id.toString(),
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
            name: creator[0]?.user_profile?.[0]?.display_name || 'Unknown',
            username: creator[0]?.user_profile?.[0]?.username || 'user',
            avatar: creator[0]?.user_profile?.[0]?.avatar_url || null
          },
          userInteraction: {
            isSaved,
            isPurchased: false // TODO: check if user owns this
          },
          createdAt: item.createdAt
        }
      })
    )

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
