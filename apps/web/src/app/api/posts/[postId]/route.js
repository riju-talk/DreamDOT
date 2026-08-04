import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Post } from '@repo/database-mongo'

export async function GET(_request, { params }) {
  try {
    const { postId } = await params

    // Fetch post metadata from PostgreSQL
    const sqlPost = await prismaSocial.posts.findUnique({
      where: { id: postId },
      include: {
        comments: {
          select: {
            comment_id: true,
            user_id: true,
            content: true,
            created_at: true,
          },
        },
        likes: {
          select: {
            user_id: true,
          },
        },
        posts_analytics: true,
      },
    })

    if (!sqlPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Fetch post content from MongoDB
    await connectToDatabase()
    const mongoPost = await Post.findOne({ sqlId: sqlPost.id })

    // Fetch user data
    const user = await prismaUser.users.findUnique({
      where: { id: sqlPost.user_id },
      select: {
        id: true,
        is_verified: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            avatar_url: true,
          },
        },
      },
    })

    // Fetch comment authors
    const commentUserIds = sqlPost.comments.map((c) => c.user_id)
    const commentUsers = {}

    if (commentUserIds.length > 0) {
      const commentUsersData = await prismaUser.users.findMany({
        where: { id: { in: commentUserIds } },
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
      commentUsersData.forEach((u) => {
        commentUsers[u.id] = u
      })
    }

    return NextResponse.json(
      {
        post: {
          id: sqlPost.id,
          userId: sqlPost.user_id,
          content: mongoPost?.content ?? '',
          media: mongoPost?.media ?? [],
          visibility: sqlPost.visibility,
          createdAt: sqlPost.created_at,
          likes: sqlPost.likes.map((l) => l.user_id),
          comments: sqlPost.comments.map((c) => ({
            id: c.comment_id,
            userId: c.user_id,
            content: c.content,
            createdAt: c.created_at,
            user: {
              username: commentUsers[c.user_id]?.user_profile?.username || 'user',
              display_name: commentUsers[c.user_id]?.user_profile?.display_name || null,
              avatar_url: commentUsers[c.user_id]?.user_profile?.avatar_url || null,
            },
          })),
          user: {
            id: user?.id || sqlPost.user_id,
            username: user?.user_profile?.username || 'user',
            display_name: user?.user_profile?.display_name || null,
            avatar_url: user?.user_profile?.avatar_url || null,
            verified: user?.is_verified || false,
          },
          analytics: {
            likes_count: sqlPost.posts_analytics?.likes_count ?? 0,
            comments_count: sqlPost.posts_analytics?.comments_count ?? 0,
            views_count: sqlPost.posts_analytics?.views_count ?? 0,
            shares_count: 0,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  return prismaUser.users.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
}

export async function PATCH(request, { params }) {
  try {
    const { postId } = await params
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    if (content.length > 5000) {
      return NextResponse.json({ error: 'Content cannot exceed 5000 characters' }, { status: 400 })
    }

    const post = await prismaSocial.posts.findUnique({ where: { id: postId } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    if (post.user_id !== user.id) {
      return NextResponse.json({ error: 'You can only edit your own posts' }, { status: 403 })
    }

    await prismaSocial.posts.update({
      where: { id: postId },
      data: { content: content.trim(), updated_at: new Date() },
    })

    await connectToDatabase()
    await Post.updateOne(
      { sqlId: postId },
      { $set: { content: content.trim(), updatedAt: new Date() } }
    ).catch(() => {})

    return NextResponse.json({ success: true, message: 'Post updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { postId } = await params
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prismaSocial.posts.findUnique({ where: { id: postId } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    if (post.user_id !== user.id) {
      return NextResponse.json({ error: 'You can only delete your own posts' }, { status: 403 })
    }

    await connectToDatabase()
    await Post.deleteOne({ sqlId: postId }).catch(() => {})

    await prismaSocial.posts_analytics.deleteMany({ where: { post_id: postId } }).catch(() => {})
    await prismaSocial.likes.deleteMany({ where: { post_id: postId } }).catch(() => {})
    await prismaSocial.comments.deleteMany({ where: { post_id: postId } }).catch(() => {})
    await prismaSocial.saves.deleteMany({ where: { post_id: postId } }).catch(() => {})
    await prismaSocial.shares.deleteMany({ where: { post_id: postId } }).catch(() => {})
    await prismaSocial.posts.delete({ where: { id: postId } })

    return NextResponse.json({ success: true, message: 'Post deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
