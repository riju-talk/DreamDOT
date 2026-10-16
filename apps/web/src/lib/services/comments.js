import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'
import { sendNotification } from '@/lib/notifications'
import { ServiceError } from './errors'

/**
 * Add a (optionally threaded) comment to a post and notify the post owner.
 * The notification is fire-and-forget: it goes to a different service (apps/notifications)
 * and that service's availability must never block a comment (availability over consistency).
 */
export async function addComment({ userId, postId, content, parentCommentId = null }) {
  if (!content?.trim()) throw new ServiceError('VALIDATION_ERROR', 'Comment content is required', 400)

  const post = await prismaSocial.posts.findUnique({ where: { id: postId } })
  if (!post) throw new ServiceError('NOT_FOUND', 'Post not found', 404)

  const comment = await prismaSocial.comments.create({
    data: { post_id: postId, user_id: userId, content: content.trim(), parent_comment_id: parentCommentId },
  })

  await prismaSocial.posts_analytics.upsert({
    where: { post_id: postId },
    update: { comments_count: { increment: 1 } },
    create: { post_id: postId, comments_count: 1 },
  })

  const author = await prismaUser.users.findUnique({
    where: { id: userId },
    select: { user_profile: { select: { username: true, display_name: true, avatar_url: true } } },
  })

  if (post.user_id !== userId) {
    const name = author?.user_profile?.display_name || author?.user_profile?.username || 'Someone'
    sendNotification(post.user_id, 'comment', `${name} commented on your post`).catch((err) =>
      console.error('[comments] notification dispatch failed (non-fatal):', err.message)
    )
  }

  return { comment, profile: author?.user_profile ?? null }
}
