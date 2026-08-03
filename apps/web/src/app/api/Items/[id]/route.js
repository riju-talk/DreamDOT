import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/prisma/social'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

export async function GET(request, { params }) {
  try {
    // 1. Authenticate user (optional)
    const session = await getServerSession()
    const userId = session?.user?.email ? (
      await prismaSocial.users.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
    )?.id : null

    const itemId = params.id
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // 2. Connect to MongoDB
    await connectToDatabase()

    // 3. Get item details
    const item = await Item.findById(itemId).lean()
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Check visibility
    if (item.visibility !== 'public' && item.userId !== userId) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // 4. Get creator profile
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

    // 5. Check if user saved (if authenticated)
    let isSaved = false
    if (userId) {
      const saved = await prismaSocial.favorites.findFirst({
        where: {
          user_id: userId,
          item_id: itemId
        }
      })
      isSaved = !!saved
    }

    // 6. Check if user owns this item (if authenticated)
    let isPurchased = false
    if (userId) {
      // Check in transactions
      const transaction = await prismaSocial.transactions.findFirst({
        where: {
          buyer_id: userId,
          item_id: itemId,
          payment_status: 'completed'
        }
      })
      isPurchased = !!transaction
    }

    // 7. Format response
    const response = {
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      price: item.price,
      images: item.media || [],
      rating: item.rating,
      reviews: item.reviews,
      sales: item.sales,
      tags: item.tags || [],
      creator: {
        id: item.userId,
        name: creator[0]?.user_profile?.[0]?.display_name || 'Unknown',
        username: creator[0]?.user_profile?.[0]?.username || 'user',
        avatar: creator[0]?.user_profile?.[0]?.avatar_url || null
      },
      userInteraction: {
        isSaved,
        isPurchased
      },
      metadata: item.metadata || {},
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Get item details error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
