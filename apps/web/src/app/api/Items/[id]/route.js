import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaItems } from '@/lib/prisma/items'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

const MAX_TITLE = 140
const MAX_CONTENT = 5000
const MAX_MEDIA = 10

async function resolveItem(itemId) {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(itemId)
  let item = await Item.findOne({ sqlId: itemId }).lean()
  if (!item && isObjectId) {
    item = await Item.findById(itemId).lean()
  }
  return item
}

export async function PUT(request, { params }) {
  try {
    const { id: itemId } = await params
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prismaItems.users.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await connectToDatabase()

    const item = await resolveItem(itemId)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    if (item.userId !== user.id) {
      return NextResponse.json({ error: 'You can only edit your own items' }, { status: 403 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const {
      title,
      script,
      category,
      pricingModel,
      priceCredits,
      subscriptionBillingCycle,
      description,
      media,
      thumbnailUrl,
      tags,
      visibility,
    } = body

    // Keep the two fields separate: short blurb vs. full content
    const newScript =
      typeof script === 'string' && script.trim().length > 0 ? script.trim() : null
    const newDescription =
      typeof description === 'string' && description.trim() ? description.trim().substring(0, 2000) : null

    const content = newScript || item.metadata?.script || ''
    if (content.length < 10) {
      return NextResponse.json({ error: 'Content must be at least 10 characters' }, { status: 400 })
    }
    if (content.length > MAX_CONTENT) {
      return NextResponse.json({ error: `Content cannot exceed ${MAX_CONTENT} characters` }, { status: 400 })
    }

    const cleanDescription = newDescription ?? item.description || ''

    const cleanTitle = typeof title === 'string' && title.trim() ? title.trim().substring(0, MAX_TITLE) : item.title
    const cleanCategory = typeof category === 'string' && category.trim() ? category.trim() : item.category
    const cleanVisibility = ['public', 'private', 'unlisted'].includes(visibility) ? visibility : item.visibility
    const cleanTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 20)
      : item.tags || []
    const cleanMedia = Array.isArray(media)
      ? media
          .filter((m) => m && typeof m.url === 'string' && m.url.length > 0)
          .slice(0, MAX_MEDIA)
          .map((m) => ({
            url: m.url,
            mimeType: typeof m.mimeType === 'string' ? m.mimeType : '',
            size: typeof m.size === 'number' ? m.size : 0,
          }))
      : item.media || []

    const price = typeof priceCredits === 'number' && !isNaN(priceCredits) ? Math.max(0, priceCredits) : item.price

    // 1. Update MongoDB (content source of truth)
    const updateData = {
      title: cleanTitle,
      description: content,
      category: cleanCategory,
      price,
      visibility: cleanVisibility,
      media: cleanMedia,
      tags: cleanTags,
      metadata: {
        ...(item.metadata || {}),
        script: content,
        thumbnailUrl: typeof thumbnailUrl === 'string' && thumbnailUrl ? thumbnailUrl : (item.metadata?.thumbnailUrl || cleanMedia[0]?.url || ''),
      },
    }
    if (typeof pricingModel === 'string' && ['free', 'paid', 'subscription'].includes(pricingModel)) {
      updateData.monetizationType = pricingModel === 'subscription' ? 'subscription' : pricingModel === 'paid' ? 'one-time' : 'free'
    }
    if (subscriptionBillingCycle === 'monthly' || subscriptionBillingCycle === 'annually') {
      updateData.metadata.subscriptionBillingCycle = subscriptionBillingCycle
    }

    await Item.updateOne({ _id: item._id }, { $set: updateData })

    // 2. Update PostgreSQL metadata (if the row exists)
    const pgItem = await prismaItems.items.findUnique({ where: { item_id: item.sqlId || itemId } })
    if (pgItem) {
      await prismaItems.items.update({
        where: { item_id: pgItem.item_id },
        data: {
          title: cleanTitle,
          description: content.substring(0, 2000),
          category: cleanCategory,
          price: pricingModel === 'subscription' ? (pgItem.price ?? price) : price,
          monetization_type: pricingModel && ['free', 'paid', 'subscription'].includes(pricingModel) ? pricingModel : pgItem.monetization_type,
          availability: cleanVisibility === 'private' ? false : pgItem.availability,
          visibility: cleanVisibility,
        },
      })

      if (pricingModel === 'subscription') {
        const monthly = Number(priceCredits) > 0 ? Number(priceCredits) : undefined
        await prismaItems.monetization.deleteMany({ where: { item_id: pgItem.item_id } })
        await prismaItems.monetization.createMany({
          data: [
            { item_id: pgItem.item_id, type: 'monthly', price: monthly ?? 500 },
            { item_id: pgItem.item_id, type: 'annual', price: monthly !== undefined ? monthly * 10 : 5000 },
          ],
        })
      }
    }

    return NextResponse.json({
      success: true,
      itemId: item.sqlId || item._id.toString(),
      message: 'Item updated successfully',
    }, { status: 200 })
  } catch (error) {
    console.error('Update item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    const { id: itemId } = await params

    // 1. Authenticate user (optional)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.email ? (
      await prismaItems.users.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
    )?.id : null

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // 2. Connect to MongoDB
    await connectToDatabase()

    // 3. Get item details - primary key is the PostgreSQL UUID (sqlId), fall back to Mongo _id for legacy links
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(itemId)
    console.log(`🔍 Looking up item - ID: ${itemId}, isObjectId: ${isObjectId}`)
    
    let item = await Item.findOne({ sqlId: itemId }).lean()
    console.log(`📦 Query result (by sqlId): ${item ? 'Found' : 'Not found'}`)
    
    if (!item && isObjectId) {
      console.log(`🔄 Trying fallback by MongoDB _id...`)
      item = await Item.findById(itemId).lean()
      console.log(`📦 Query result (by _id): ${item ? 'Found' : 'Not found'}`)
    }
    
    if (!item) {
      console.error(`❌ Item not found - searched by sqlId: ${itemId}, isObjectId: ${isObjectId}`)
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Check visibility
    if (item.visibility !== 'public' && item.userId !== userId) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // 4. Get creator profile
    const creator = await prismaItems.users.findFirst({
      where: { id: item.userId },
      select: {
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

    // 5. Check if user saved (if authenticated)
    // favorites.item_id is a PG UUID column, so only query with the item's sqlId (never the Mongo _id)
    const pgItemId = item.sqlId || null
    let isSaved = false
    if (userId && pgItemId) {
      const saved = await prismaItems.favorites.findFirst({
        where: {
          user_id: userId,
          item_id: pgItemId
        }
      })
      isSaved = !!saved
    }

    // 6. Check if user owns this item (if authenticated)
    let isPurchased = false
    if (userId && pgItemId) {
      // Check in transactions
      const transaction = await prismaItems.transactions.findFirst({
        where: {
          buyer_id: userId,
          item_id: pgItemId,
          payment_status: 'completed'
        }
      })
      isPurchased = !!transaction
    }

    // 7. Format response
    const response = {
      id: item.sqlId || item._id.toString(),
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
        name: creator?.user_profile?.display_name || 'Unknown',
        username: creator?.user_profile?.username || 'user',
        avatar: creator?.user_profile?.avatar_url || null,
        verified: creator?.is_verified || false
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
