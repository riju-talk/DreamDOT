import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'

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

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const post = await prismaSocial.posts.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const existingSave = await prismaSocial.saves.findFirst({
      where: {
        user_id: user.id,
        post_id: postId,
      }
    })

    if (existingSave) {
      return NextResponse.json({ error: 'Post already saved' }, { status: 400 })
    }

    const save = await prismaSocial.saves.create({
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

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const result = await prismaSocial.saves.deleteMany({
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

export async function GET(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const total = await prismaSocial.saves.count({
      where: { user_id: user.id }
    })

    const saves = await prismaSocial.saves.findMany({
      where: { user_id: user.id },
      include: {
        posts: {
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
      id: save.posts.id,
      userId: save.posts.user_id,
      description: save.posts.description,
      visibility: save.posts.visibility,
      createdAt: save.posts.created_at,
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
