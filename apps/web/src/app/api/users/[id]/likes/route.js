import { NextResponse } from 'next/server'
import { prismaSocial } from '@/lib/prisma/social'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Post } from '@repo/database-mongo'

export async function GET(_request, { params }) {
  try {
    const { id: userId } = await params

    // Verify user exists
    const user = await prismaSocial.users.findUnique({
      where: { id: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch liked posts - query the likes table for this user
    const likeRecords = await prismaSocial.likes.findMany({
      where: { user_id: userId },
      select: { post_id: true },
      orderBy: { liked_at: 'desc' },
      take: 50
    })

    if (likeRecords.length === 0) {
      return NextResponse.json(
        { posts: [] },
        { status: 200 }
      )
    }

    // Get the post IDs
    const postIds = likeRecords.map(lr => lr.post_id)

    // Fetch posts from social schema
    const sqlPosts = await prismaSocial.posts.findMany({
      where: { id: { in: postIds } },
      select: {
        id: true,
        user_id: true,
        created_at: true,
        posts_analytics: true,
      }
    })

    // Connect to MongoDB to fetch post content
    await connectToDatabase()

    // Get MongoDB posts
    const mongoPosts = await Post.collection
      .find({ sqlId: { $in: sqlPosts.map(p => p.id) } })
      .toArray()

    const mongoPostsMap = new Map()
    mongoPosts.forEach(post => {
      if (post.sqlId) {
        mongoPostsMap.set(post.sqlId, post)
      }
    })

    // Fetch user data
    const userIds = sqlPosts.map(p => p.user_id).filter(Boolean)
    const userData = {}

    if (userIds.length > 0) {
      const users = await prismaSocial.users.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          user_profile: {
            select: {
              display_name: true,
              username: true,
              avatar_url: true,
            }
          }
        }
      })
      users.forEach(u => {
        userData[u.id] = u
      })
    }

    // Merge data
    const enrichedPosts = sqlPosts.map(sqlPost => {
      const mongoPost = mongoPostsMap.get(sqlPost.id)
      const user = userData[sqlPost.user_id]

      return {
        id: sqlPost.id,
        userId: sqlPost.user_id,
        content: mongoPost?.content ?? '',
        media: mongoPost?.media ?? [],
        visibility: mongoPost?.visibility ?? true,
        createdAt: mongoPost?.createdAt ?? sqlPost.created_at,
        analytics: {
          likes_count: sqlPost.posts_analytics?.likes_count ?? 0,
          comments_count: sqlPost.posts_analytics?.comments_count ?? 0,
          views_count: sqlPost.posts_analytics?.views_count ?? 0,
        },
        user: {
          id: user?.id || sqlPost.user_id,
          username: user?.user_profile?.username || 'user',
          display_name: user?.user_profile?.display_name || null,
          avatar_url: user?.user_profile?.avatar_url || '/placeholder.svg',
        }
      }
    })

    return NextResponse.json(
      { posts: enrichedPosts },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching liked posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
