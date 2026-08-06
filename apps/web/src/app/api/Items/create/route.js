import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaItems } from '@/lib/prisma/items'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Item, User } from '@repo/database-mongo'

const MAX_TITLE = 140
const MAX_CONTENT = 5000
const MAX_MEDIA = 10
const DEFAULT_MONTHLY = 500
const DEFAULT_ANNUAL = 5000

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prismaItems.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { title, script, category, pricingModel, priceCredits, subscriptionBillingCycle, description, bundleItemIds, media, thumbnailUrl, assetType } = body

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (title.trim().length > MAX_TITLE) {
      return NextResponse.json({ error: `Title must be ${MAX_TITLE} characters or less` }, { status: 400 })
    }
    const content =
      typeof script === 'string' && script.trim().length > 0
        ? script.trim()
        : typeof description === 'string'
          ? description.trim()
          : ''
    if (!content || content.length < 10) {
      return NextResponse.json({ error: 'Content must be at least 10 characters' }, { status: 400 })
    }
    if (content.length > MAX_CONTENT) {
      return NextResponse.json({ error: `Content cannot exceed ${MAX_CONTENT} characters` }, { status: 400 })
    }
    // Short blurb is a separate field from the full content
    const cleanDescription =
      typeof description === 'string' ? description.trim().substring(0, 2000) : ''
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    if (!['free', 'paid', 'subscription'].includes(pricingModel)) {
      return NextResponse.json({ error: 'Invalid pricing model' }, { status: 400 })
    }
    if (assetType === 'bundle' && (!Array.isArray(bundleItemIds) || bundleItemIds.length < 2)) {
      return NextResponse.json({ error: 'Bundle requires at least 2 items' }, { status: 400 })
    }

    let monthlyCredits = DEFAULT_MONTHLY
    let annualCredits = DEFAULT_ANNUAL
    let billingCycle = typeof subscriptionBillingCycle === 'string' && subscriptionBillingCycle === 'annually' ? 'annually' : 'monthly'
    if (pricingModel === 'subscription') {
      // Prices are set by the creator in Settings → Monetization (Mongo User doc)
      await connectToDatabase()
      const mongoUser = await User.findById(user.id).lean()
      monthlyCredits = mongoUser?.monetization?.defaultMonthlyCredits ?? DEFAULT_MONTHLY
      annualCredits = mongoUser?.monetization?.defaultAnnualCredits ?? DEFAULT_ANNUAL
      if (monthlyCredits < 1 || annualCredits < 1) {
        return NextResponse.json({ error: 'Monthly and annually prices must be configured in Settings → Monetization' }, { status: 400 })
      }
    }

    // Sanitize media (uploaded via Cloudinary, URLs only). Items may only carry image/video assets.
    const cleanMedia = Array.isArray(media)
      ? media
          .filter(
            (m) =>
              m &&
              typeof m.url === 'string' &&
              m.url.length > 0 &&
              typeof m.mimeType === 'string' &&
              (m.mimeType.startsWith('image/') || m.mimeType.startsWith('video/'))
          )
          .slice(0, MAX_MEDIA)
          .map((m) => ({
            url: m.url,
            mimeType: m.mimeType,
            size: typeof m.size === 'number' ? m.size : 0,
          }))
      : []

    const price = typeof priceCredits === 'number' && !isNaN(priceCredits) ? priceCredits : 0
    const subscriptionPrice = pricingModel === 'subscription' ? (billingCycle === 'annually' ? annualCredits : monthlyCredits) : 0
    const cleanThumbnail =
      typeof thumbnailUrl === 'string' && thumbnailUrl.length > 0
        ? thumbnailUrl
        : cleanMedia[0]?.url || ''

    // A thumbnail (derived from at least one image/video asset) is mandatory for every item
    if (!cleanThumbnail) {
      return NextResponse.json({ error: 'At least one image or video asset is required for the thumbnail' }, { status: 400 })
    }

    // Helper function to strip HTML tags
    const stripHtmlTags = (html) => {
      if (!html) return ''
      return html
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .replace(/&nbsp;/g, ' ') // Replace nbsp with space
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .trim()
    }

    // STEP 1: Create PostgreSQL metadata first (item_id + sql_id must match the Mongo link)
    const sqlId = crypto.randomUUID()

    await prismaItems.items.create({
      data: {
        item_id: sqlId,
        user_id: user.id,
        sql_id: sqlId,
        title: title.trim(),
        description: cleanDescription,
        category,
        price: pricingModel === 'subscription' ? subscriptionPrice : price,
        monetization_type: pricingModel,
        availability: true,
        visibility: 'public',
        created_at: new Date(),
      },
    })

    if (pricingModel === 'subscription') {
      await prismaItems.monetization.createMany({
        data: [
          { item_id: sqlId, type: 'monthly', price: monthlyCredits },
          { item_id: sqlId, type: 'annual', price: annualCredits },
        ],
      })
    }

    console.log(`✅ SQL item metadata created - ID: ${sqlId}`)

    // STEP 2: Create MongoDB item (actual content + media), linked via sqlId
    let mongoItem
    try {
      await connectToDatabase()

      const itemData = {
        userId: user.id,
        sqlId,
        title: title.trim(),
        description: cleanDescription,
        category,
        price: pricingModel === 'subscription' ? subscriptionPrice : price,
        visibility: 'public',
        media: cleanMedia,
        rating: 0,
        reviews: 0,
        sales: 0,
        purchases: [],
        tags: [],
        featured: false,
        drm: {
          enabled: true,
          watermark: true,
          tracking: true,
        },
        monetizationType:
          pricingModel === 'subscription' ? 'subscription' : pricingModel === 'paid' ? 'one-time' : 'free',
        metadata: {
          script: content,
          bundleItemIds: assetType === 'bundle' ? bundleItemIds : [],
          thumbnailUrl: cleanThumbnail,
          originalCategory: category,
          subscriptionBillingCycle: pricingModel === 'subscription' ? billingCycle : null,
          subscriptionMonthlyCredits: pricingModel === 'subscription' ? monthlyCredits : 0,
          subscriptionAnnualCredits: pricingModel === 'subscription' ? annualCredits : 0,
        },
      }

      console.log('📝 Creating MongoDB item with data:', {
        userId: itemData.userId,
        title: itemData.title,
        price: itemData.price,
        monetizationType: itemData.monetizationType,
        pricingModel,
      })

      mongoItem = await Item.create(itemData)

      if (!mongoItem || !mongoItem._id) {
        throw new Error(`MongoDB item creation failed - no _id returned: ${JSON.stringify(mongoItem)}`)
      }

      // Defensive: if the running Item model stripped sqlId (e.g. stale build),
      // force it so the item URL always resolves
      if (mongoItem.sqlId !== sqlId) {
        await Item.updateOne({ _id: mongoItem._id }, { $set: { sqlId } })
      }

      console.log(`✅ MongoDB item created - _id: ${mongoItem._id.toString()}, sqlId: ${sqlId}`)
      console.log(`📦 Item details - Title: ${title}, Price: ${price}, Pricing Model: ${pricingModel}`)
    } catch (mongoError) {
      console.error('MongoDB item creation failed, rolling back SQL metadata:', mongoError)
      console.error('MongoDB error details:', {
        name: mongoError?.name,
        message: mongoError?.message,
        code: mongoError?.code,
      })
      await prismaItems.monetization.deleteMany({ where: { item_id: sqlId } }).catch(() => {})
      await prismaItems.items.delete({ where: { item_id: sqlId } }).catch(() => {})
      throw mongoError
    }

    const itemIdString = sqlId
    console.log(`✅ Returning response with itemId (UUID): ${itemIdString}`)

    return NextResponse.json(
      {
        success: true,
        itemId: itemIdString,
        createdAt: mongoItem.createdAt,
        message: 'Item published successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create item error:', error)
    console.error('Error stack:', error?.stack)
    console.error('Error type:', error?.constructor?.name)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error?.message || 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
