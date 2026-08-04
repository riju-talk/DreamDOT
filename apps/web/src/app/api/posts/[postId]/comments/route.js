import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await params
    const { content, parentCommentId } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }

    // Get current user ID
    const currentUser = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if post exists
    const post = await prismaSocial.posts.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create comment
    const comment = await prismaSocial.comments.create({
      data: {
        post_id: postId,
        user_id: currentUser.id,
        content,
        parent_comment_id: parentCommentId || null,
      },
    })

    // Update analytics
    await prismaSocial.posts_analytics.upsert({
      where: { post_id: postId },
      update: { comments_count: { increment: 1 } },
      create: {
        post_id: postId,
        comments_count: 1,
        views_count: 0,
        likes_count: 0,
      },
    })

    // Get comment user data
    const user = await prismaUser.users.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            avatar_url: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        comment: {
          id: comment.comment_id,
          userId: comment.user_id,
          content: comment.content,
          createdAt: comment.created_at,
          user: {
            username: user?.user_profile?.username || 'user',
            display_name: user?.user_profile?.display_name || null,
            avatar_url: user?.user_profile?.avatar_url || null,
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(_request, { params }) {
  try {
    const { postId } = await params

    // Fetch comments
    const comments = await prismaSocial.comments.findMany({
      where: { post_id: postId },
      include: {
        other_comments: true,
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    })

    // Get comment author data
    const userIds = comments.map((c) => c.user_id)
    const users = {}

    if (userIds.length > 0) {
      const usersData = await prismaUser.users.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          user_profile: {
            select: {
              username: true,
              display_name: true,
              avatar_url: true,
            },
          },
        },
      })
      usersData.forEach((u) => {
        users[u.id] = u
      })
    }

    return NextResponse.json(
      {
        comments: comments.map((c) => ({
          id: c.comment_id,
          userId: c.user_id,
          content: c.content,
          createdAt: c.created_at,
          user: {
            username: users[c.user_id]?.user_profile?.username || 'user',
            display_name: users[c.user_id]?.user_profile?.display_name || null,
            avatar_url: users[c.user_id]?.user_profile?.avatar_url || null,
          },
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
