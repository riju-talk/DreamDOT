import { NextResponse } from 'next/server'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'
import { addComment } from '@/lib/services/comments'
import { errorResponse, getSessionUserId, unauthorized } from '@/lib/services/http'

/** POST /api/posts/:postId/comments - REST twin of the GraphQL `addComment` mutation. */
export async function POST(request, { params }) {
  try {
    const userId = await getSessionUserId()
    if (!userId) return unauthorized()

    const { postId } = await params
    const { content, parentCommentId } = await request.json().catch(() => ({}))
    const { comment, profile } = await addComment({ userId, postId, content, parentCommentId })

    return NextResponse.json(
      {
        comment: {
          id: comment.comment_id,
          userId: comment.user_id,
          content: comment.content,
          createdAt: comment.created_at,
          user: {
            username: profile?.username || 'user',
            display_name: profile?.display_name || null,
            avatar_url: profile?.avatar_url || null,
          },
        },
      },
      { status: 201 }
    )
  } catch (err) {
    return errorResponse(err, 'create comment')
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
