import { prismaSocial } from '@/lib/prisma/social'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Post } from '@repo/database-mongo'
import { ServiceError } from './errors'

/**
 * Create a post across two stores: Postgres (metadata/relations) and Mongo (body/media).
 *
 * CAP / consistency note: there is no distributed transaction (2PC) between the two
 * databases, on purpose - it would couple the availability of both stores. Instead this
 * is a small SAGA: write Postgres first (the source of truth for existence), then Mongo,
 * and if the second step fails run a COMPENSATING delete on the first. Between the two
 * writes a reader could see a post without its Mongo document, so readers must tolerate
 * that (eventual consistency). We choose availability + eventual consistency over atomicity.
 *
 * @param {{ userId: string, content: string, media?: Array, visibility?: boolean }} input
 */
export async function createPost({ userId, content, media = [], visibility = true }) {
  const text = typeof content === 'string' ? content.trim() : ''
  if (!text) throw new ServiceError('VALIDATION_ERROR', 'Content is required', 400)
  if (text.length > 5000) throw new ServiceError('VALIDATION_ERROR', 'Content cannot exceed 5000 characters', 400)
  if (media.length > 5) throw new ServiceError('VALIDATION_ERROR', 'Cannot attach more than 5 images', 400)

  // posts.id === posts.sql_id === mongo.sqlId: one id, usable as the join key in both stores.
  const postId = crypto.randomUUID()
  const now = new Date()

  // Step 1: Postgres (source of truth).
  const row = await prismaSocial.posts.create({
    data: { id: postId, sql_id: postId, user_id: userId, content: text, visibility, created_at: now, updated_at: now },
  })

  // Step 2: Mongo; on failure undo step 1 (compensation) and surface the error.
  try {
    await connectToDatabase()
    await new Post({
      userId,
      sqlId: postId,
      content: text,
      media,
      visibility,
      createdAt: now,
      updatedAt: now,
      likes: [],
      comments: [],
      shares: 0,
      saves: [],
      category: 'general',
      tags: [],
      engagementScore: 0,
      isSponsored: false,
    }).save()
  } catch (err) {
    console.error('[posts] Mongo write failed, compensating SQL insert:', err)
    await prismaSocial.posts.delete({ where: { id: postId } }).catch((e) => console.error('[posts] compensation failed:', e))
    throw new ServiceError('INTERNAL', 'Could not create post', 500)
  }

  // Step 3: derived counters. Best-effort: a failure here must not fail the post (recomputable).
  await Promise.all([
    prismaSocial.posts_analytics.create({ data: { post_id: postId } }),
    prismaSocial.user_analytics.upsert({
      where: { user_id: userId },
      update: { posts_count: { increment: 1 } },
      create: { user_id: userId, posts_count: 1 },
    }),
  ]).catch((err) => console.error('[posts] analytics update failed (non-fatal):', err.message))

  return row
}
