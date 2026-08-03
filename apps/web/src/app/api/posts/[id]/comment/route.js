import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prismaSocial } from '@/lib/prisma/social'
import { Post } from '@repo/database-mongo'
import { connectToDatabase } from '@/lib/mongoose/connection'

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

    // 3. Parse request body
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment text required' },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Comment too long (max 5000 chars)' },
        { status: 400 }
      )
    }

    // 4. Connect to MongoDB
    await connectToDatabase()

    // 5. Add comment to post
    const post = await Post.findById(postId)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const comment = {
      userId: user.id,
      text: text.trim(),
      timestamp: new Date()
    }

    post.comments.push(comment)
    await post.save()

    // 6. Get creator info for response
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

    return NextResponse.json(
      {
        success: true,
        comment: {
          id: comment._id || new Date().getTime(),
          userId: user.id,
          creator: {
            name: creator[0]?.user_profile?.[0]?.display_name || 'Unknown',
            username: creator[0]?.user_profile?.[0]?.username || 'user',
            avatar: creator[0]?.user_profile?.[0]?.avatar_url || null
          },
          text: comment.text,
          timestamp: comment.timestamp
        },
        commentCount: post.comments.length
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    // 1. Authenticate user (optional for reading)
    const session = await getServerSession()
    const userId = session?.user?.email ? (
      await prismaSocial.users.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
    )?.id : null

    const postId = params.id
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // 2. Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit')) || 20))

    // 3. Connect to MongoDB
    await connectDB()

    // 4. Get post
    const post = await Post.findById(postId)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const comments = post.comments || []
    const total = comments.length

    // 5. Paginate comments
    const skip = (page - 1) * limit
    const paginatedComments = comments.slice(skip, skip + limit)

    // 6. Enrich comments with user info
    const enrichedComments = await Promise.all(
      paginatedComments.map(async (comment) => {
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

        return {
          id: comment._id || new Date().getTime(),
          userId: comment.userId,
          creator: {
            id: comment.userId,
            name: creator[0]?.user_profile?.[0]?.display_name || 'Unknown',
            username: creator[0]?.user_profile?.[0]?.username || 'user',
            avatar: creator[0]?.user_profile?.[0]?.avatar_url || null
          },
          text: comment.text,
          timestamp: comment.timestamp
        }
      })
    )

    return NextResponse.json(
      {
        comments: enrichedComments,
        hasMore: skip + enrichedComments.length < total,
        total,
        page,
        limit
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
