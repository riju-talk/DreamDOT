import { NextResponse } from 'next/server'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { prismaSocial } from '@/lib/prisma/social'

export async function GET(request, { params }) {
  try {
    const itemId = params.id
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // 1. Connect to MongoDB
    await connectToDatabase()

    // 2. Get the item
    const item = await Item.findById(itemId).lean()
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // 3. Find related items
    // Related by: category, similar price range, and rating
    const priceRange = item.price * 0.5 // 50% tolerance
    let relatedItems = await Item.find({
      _id: { $ne: itemId },
      visibility: 'public',
      category: item.category,
      price: {
        $gte: item.price - priceRange,
        $lte: item.price + priceRange
      }
    })
      .sort({ rating: -1, sales: -1 })
      .limit(6)
      .lean()

    // If not enough items found, expand search to same category only
    if (relatedItems.length < 4) {
      relatedItems = await Item.find({
        _id: { $ne: itemId },
        visibility: 'public',
        category: item.category
      })
        .sort({ rating: -1, sales: -1 })
        .limit(6)
        .lean()
    }

    // If still not enough, search all public items
    if (relatedItems.length < 4) {
      relatedItems = await Item.find({
        _id: { $ne: itemId },
        visibility: 'public'
      })
        .sort({ rating: -1, sales: -1 })
        .limit(6)
        .lean()
    }

    // 4. Enrich with creator info
    const enrichedItems = await Promise.all(
      relatedItems.map(async (relItem) => {
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

        return {
          id: relItem._id.toString(),
          title: relItem.title,
          description: relItem.description,
          category: relItem.category,
          price: relItem.price,
          image: relItem.media?.[0]?.url || null,
          rating: relItem.rating,
          reviews: relItem.reviews,
          sales: relItem.sales,
          creator: {
            id: relItem.userId,
            name: creator[0]?.user_profile?.[0]?.display_name || 'Unknown',
            username: creator[0]?.user_profile?.[0]?.username || 'user',
            avatar: creator[0]?.user_profile?.[0]?.avatar_url || null
          }
        }
      })
    )

    return NextResponse.json(
      {
        relatedItems: enrichedItems,
        count: enrichedItems.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get related items error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
