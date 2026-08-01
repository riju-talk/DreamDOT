import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/db'

export async function POST(request, { params }) {
  try {
    // 1. Authenticate user
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user by email
    const user = await prismaSocial.users.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const postId = params.id
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // 3. Check if post exists
    const existingLike = await prismaSocial.likes.findFirst({
      where: {
        post_id: postId,
        user_id: user.id
      }
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 409 }
      )
    }

    // 4. Add like to database
    await prismaSocial.likes.create({
      data: {
        post_id: postId,
        user_id: user.id,
        liked_at: new Date()
      }
    })

    // 5. Get updated like count
    const likeCount = await prismaSocial.likes.count({
      where: { post_id: postId }
    })

    return NextResponse.json(
      {
        success: true,
        likeCount,
        isLiked: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Like post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // 1. Authenticate user
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get user by email
    const user = await prismaSocial.users.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const postId = params.id
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // 3. Delete the like
    const deleted = await prismaSocial.likes.deleteMany({
      where: {
        post_id: postId,
        user_id: user.id
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      )
    }

    // 4. Get updated like count
    const likeCount = await prismaSocial.likes.count({
      where: { post_id: postId }
    })

    return NextResponse.json(
      {
        success: true,
        likeCount,
        isLiked: false
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unlike post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
