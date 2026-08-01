import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

/**
 * POST /api/posts/save
 * Save a post to user's collection
 */
export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

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

    // Check if already saved
    const existingSave = await prisma.saves.findFirst({
      where: {
        user_id: user.id,
        post_id: postId,
      }
    })

    if (existingSave) {
      return NextResponse.json({ error: 'Post already saved' }, { status: 400 })
    }

    // Create the save
    const save = await prisma.saves.create({
      data: {
        user_id: user.id,
        post_id: postId,
      },
    })

    console.log(`✅ Post saved - user: ${user.id}, post: ${postId}`)

    return NextResponse.json(
      {
        success: true,
        postId,
        saved: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving post:', error)
    return NextResponse.json(
      { error: 'Failed to save post' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/posts/save
 * Unsave a post
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

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

    // Delete the save
    const result = await prisma.saves.deleteMany({
      where: {
        user_id: user.id,
        post_id: postId,
      },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: 'Save not found' }, { status: 404 })
    }

    console.log(`✅ Post unsaved - user: ${user.id}, post: ${postId}`)

    return NextResponse.json(
      {
        success: true,
        postId,
        saved: false,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error unsaving post:', error)
    return NextResponse.json(
      { error: 'Failed to unsave post' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/posts/save
 * Get saved posts for current user
 */
export async function GET(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get the current user
    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get total count
    const total = await prisma.saves.count({
      where: { user_id: user.id }
    })

    // Get paginated saves
    const saves = await prisma.saves.findMany({
      where: { user_id: user.id },
      include: {
        posts_metadata: {
          include: {
            users: {
              select: { id: true, email: true }
            }
          }
        }
      },
      orderBy: { saved_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const savedPosts = saves.map(save => ({
      id: save.posts_metadata.id,
      userId: save.posts_metadata.user_id,
      description: save.posts_metadata.description,
      visibility: save.posts_metadata.visibility,
      createdAt: save.posts_metadata.created_at,
      savedAt: save.saved_at,
    }))

    console.log(`✅ Fetched ${savedPosts.length} saved posts for user ${user.id}`)

    return NextResponse.json(
      {
        saves: savedPosts,
        total,
        page,
        limit,
        hasMore: (page - 1) * limit + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching saved posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved posts' },
      { status: 500 }
    )
  }
}
