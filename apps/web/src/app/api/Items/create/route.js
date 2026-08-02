import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Item } from '@/models/Item'
import { User } from '@/models/User'

export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, thumbnailUrl, script, category, pricingModel, priceCredits, description, bundleItemIds } = body

    // Validate required fields
    if (!title || title.length < 1 || title.length > 140) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 })
    }
    if (!script || script.length < 10) {
      return NextResponse.json({ error: 'Script must be at least 10 characters' }, { status: 400 })
    }
    if (!thumbnailUrl) {
      return NextResponse.json({ error: 'Thumbnail is required' }, { status: 400 })
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }
    if (pricingModel === 'bundle' && (!bundleItemIds || bundleItemIds.length < 2)) {
      return NextResponse.json({ error: 'Bundle requires at least 2 items' }, { status: 400 })
    }

    // Get user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create item
    const item = new Item({
      userId: user._id,
      title,
      script,
      category,
      thumbnailUrl,
      description,
      pricingModel,
      price: priceCredits,
      visibility: 'public',
      featured: false,
      isFeatured: false,
      drm: {
        enabled: true,
        watermark: true,
        tracking: true,
      },
      monetizationType: pricingModel === 'bundle' ? 'one-time' : pricingModel,
      metadata: {
        bundleItemIds: pricingModel === 'bundle' ? bundleItemIds : [],
      },
    })

    await item.save()

    console.log(`Item created: ${item._id} by user ${user._id}`)

    return NextResponse.json(
      {
        success: true,
        itemId: item._id,
        createdAt: item.createdAt,
        message: 'Item published successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
