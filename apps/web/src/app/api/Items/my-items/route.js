import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { Item } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

/**
 * GET /api/Items/my-items
 * Get all items owned by the current user
 * Query params:
 *  - search: search by title (optional)
 *  - page: page number (default: 1)
 *  - limit: items per page (default: 50)
 */
export async function GET(request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Get user ID from email
    const user = await prismaSocial.users.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 3. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit')) || 50))
    const search = searchParams.get('search') || ''

    // 4. Connect to MongoDB
    await connectToDatabase()

    // 5. Build MongoDB query for user's items
    let query = { 
      userId: user.id,
      visibility: { $in: ['public', 'private'] } // Include both public and private items
    }

    // Add search filter
    if (search.trim()) {
      query.title = {
        $regex: search,
        $options: 'i' // Case-insensitive
      }
    }

    // 6. Get total count
    const total = await Item.countDocuments(query)

    // 7. Fetch items from MongoDB
    const items = await Item.find(query)
      .select('_id sqlId title description category price createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // 8. Transform MongoDB documents
    const transformedItems = items.map(item => ({
      id: item.sqlId || item._id.toString(),
      title: item.title,
      description: item.description || '',
      category: item.category || 'other',
      price: item.price || 0,
      createdAt: item.createdAt
    }))

    return NextResponse.json({
      success: true,
      items: transformedItems,
      total,
      page,
      limit,
      hasMore: (page * limit) < total,
      message: transformedItems.length === 0 ? 'No items found' : undefined
    })
  } catch (error) {
    console.error('Error fetching user items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}
