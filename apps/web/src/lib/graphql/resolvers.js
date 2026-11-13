import { GraphQLError } from 'graphql'
import { prismaSocial } from '@/lib/prisma/social'
import { ServiceError } from '@/lib/services/errors'
import { createPost } from '@/lib/services/posts'
import { addComment } from '@/lib/services/comments'
import { getBalance, topUp } from '@/lib/services/credits'

// Resolvers are intentionally thin: authenticate, call a service, shape the result.

const requireUser = (ctx) => {
  if (!ctx.userId) throw new GraphQLError('Authentication required', { extensions: { code: 'UNAUTHENTICATED' } })
  return ctx.userId
}

/** Run a service call and translate its domain error into a GraphQL error with a stable code. */
const run = async (fn) => {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof ServiceError) throw new GraphQLError(err.message, { extensions: { code: err.code } })
    throw err
  }
}

// DB row -> GraphQL shape.
const toUser = (row) =>
  row && {
    id: row.id,
    username: row.user_profile?.username ?? null,
    displayName: row.user_profile?.display_name ?? null,
    avatarUrl: row.user_profile?.avatar_url ?? null,
  }

const toPost = (row) => ({
  id: row.id,
  content: row.content,
  createdAt: row.created_at.toISOString(),
  likeCount: row.posts_analytics?.likes_count ?? 0,
  commentCount: row.posts_analytics?.comments_count ?? 0,
  _authorId: row.user_id,
})

const toComment = (row) => ({
  id: row.comment_id,
  postId: row.post_id,
  parentId: row.parent_comment_id,
  content: row.content,
  createdAt: (row.created_at ?? new Date()).toISOString(),
  _authorId: row.user_id,
})

export const resolvers = {
  Query: {
    health: () => 'ok',

    me: async (_root, _args, ctx) => (ctx.userId ? toUser(await ctx.users.load(ctx.userId)) : null),

    feed: async (_root, { page, limit }) => {
      const take = Math.min(Math.max(limit, 1), 50) // cap page size: clients must not be able to ask for the world
      const skip = (Math.max(page, 1) - 1) * take
      const where = { visibility: true }
      const [rows, total] = await Promise.all([
        prismaSocial.posts.findMany({ where, skip, take, orderBy: { created_at: 'desc' }, include: { posts_analytics: true } }),
        prismaSocial.posts.count({ where }),
      ])
      return { posts: rows.map(toPost), total, hasMore: skip + rows.length < total }
    },

    post: async (_root, { id }) => {
      const row = await prismaSocial.posts.findUnique({ where: { id }, include: { posts_analytics: true } })
      return row ? toPost(row) : null
    },

    balance: (_root, _args, ctx) => run(() => getBalance(requireUser(ctx))),
  },

  Mutation: {
    createPost: async (_root, { content, visibility }, ctx) => {
      const row = await run(() => createPost({ userId: requireUser(ctx), content, visibility }))
      return toPost({ ...row, posts_analytics: null })
    },

    addComment: async (_root, { postId, content, parentId }, ctx) => {
      const { comment } = await run(() =>
        addComment({ userId: requireUser(ctx), postId, content, parentCommentId: parentId ?? null })
      )
      return toComment(comment)
    },

    topUp: (_root, { amount, review }, ctx) => run(() => topUp({ userId: requireUser(ctx), amount, review })),
  },

  // Field resolvers: only run when the client actually selects the field.
  Post: {
    author: async (post, _args, ctx) => toUser(await ctx.users.load(post._authorId)), // batched by the loader
    comments: async (post, { limit }) => {
      const rows = await prismaSocial.comments.findMany({
        where: { post_id: post.id },
        orderBy: { created_at: 'asc' },
        take: Math.min(limit, 200),
      })
      return rows.map(toComment)
    },
  },

  Comment: {
    author: async (comment, _args, ctx) => toUser(await ctx.users.load(comment._authorId)),
  },
}
