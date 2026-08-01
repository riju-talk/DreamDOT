import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

/**
 * POST /api/posts/share
 * Share/repost a post
 */
export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId, message } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Get the current user
    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if post exists
    const post = await prisma.posts_metadata.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create the share
    const share = await prisma.shares.create({
      data: {
        user_id: user.id,
        post_id: postId,
        share_message: message || null,
      },
    })

    console.log(`✅ Post shared - user: ${user.id}, post: ${postId}`)

    return NextResponse.json(
      {
        success: true,
        shareId: share.share_id,
        postId,
        message: share.share_message,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error sharing post:', error)
    return NextResponse.json(
      { error: 'Failed to share post' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/posts/share
 * Get shares for a post or user's shares
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    if (!postId && !userId) {
      return NextResponse.json(
        { error: 'Either postId or userId is required' },
        { status: 400 }
      )
    }

    // Build query
    const where = {}
    if (postId) where.post_id = postId
    if (userId) where.user_id = userId

    // Get total count
    const total = await prisma.shares.count({ where })

    // Get paginated shares
    const shares = await prisma.shares.findMany({
      where,
      orderBy: { shared_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    console.log(`✅ Fetched ${shares.length} shares`)

    return NextResponse.json(
      {
        shares,
        total,
        page,
        limit,
        hasMore: (page - 1) * limit + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching shares:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shares' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/share
 * Remove a share
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shareId } = await request.json()

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 })
    }

    // Get the current user
    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find the share
    const share = await prisma.shares.findUnique({
      where: { share_id: shareId }
    })

    if (!share) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 })
    }

    // Check authorization
    if (share.user_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this share' }, { status: 403 })
    }

    // Delete the share
    await prisma.shares.delete({
      where: { share_id: shareId }
    })

    console.log(`✅ Share deleted - user: ${user.id}, share: ${shareId}`)

    return NextResponse.json(
      {
        success: true,
        shareId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting share:', error)
    return NextResponse.json(
      { error: 'Failed to delete share' },
      { status: 500 }
    )
  }
}
