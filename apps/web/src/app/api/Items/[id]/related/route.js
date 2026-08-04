import { NextResponse } from 'next/server'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { prismaItems } from '@/lib/prisma/items'

export async function GET(request, { params }) {
  try {
    const { id: itemId } = await params
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // 1. Connect to MongoDB
    await connectToDatabase()

    // 2. Get the item
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(itemId)
    let item = await Item.findOne({ sqlId: itemId }).lean()
    if (!item && isObjectId) {
      item = await Item.findById(itemId).lean()
    }
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // 3. Find related items
    // Related by: category, similar price range, and rating
    const priceRange = item.price * 0.5 // 50% tolerance
    let relatedItems = await Item.find({
      _id: { $ne: item._id },
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
        _id: { $ne: item._id },
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
        _id: { $ne: item._id },
        visibility: 'public'
      })
        .sort({ rating: -1, sales: -1 })
        .limit(6)
        .lean()
    }

    // 4. Enrich with creator info
    const userIds = [...new Set(relatedItems.map((relItem) => relItem.userId).filter(Boolean))]
    const users = await prismaItems.users.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
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

    const enrichedItems = relatedItems.map((relItem) => {
      const creator = userMap.get(relItem.userId)
      return {
        id: relItem.sqlId || relItem._id.toString(),
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
          name: creator?.user_profile?.display_name || 'Unknown',
          username: creator?.user_profile?.username || 'user',
          avatar: creator?.user_profile?.avatar_url || null
        }
      }
    })

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
