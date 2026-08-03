import { NextResponse } from 'next/server'
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
