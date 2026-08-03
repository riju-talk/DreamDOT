import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'
import { hydratePosts } from '@/lib/mongoose/posts'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const post = await prismaSocial.posts.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const existingSave = await prismaSocial.saves.findFirst({
      where: {
        user_id: user.id,
        post_id: postId,
      }
    })

    if (existingSave) {
      return NextResponse.json({ error: 'Post already saved' }, { status: 400 })
    }

    const save = await prismaSocial.saves.create({
      data: {
        user_id: user.id,
        post_id: postId,
      },
    })

    console.log(`✅ Post saved - user: ${user.id}, post: ${postId}`)

    return NextResponse.json(
      {
        success: true,
        postId,
        saved: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving post:', error)
    return NextResponse.json(
      { error: 'Failed to save post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const result = await prismaSocial.saves.deleteMany({
      where: {
        user_id: user.id,
        post_id: postId,
      },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: 'Save not found' }, { status: 404 })
    }

    console.log(`✅ Post unsaved - user: ${user.id}, post: ${postId}`)

    return NextResponse.json(
      {
        success: true,
        postId,
        saved: false,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error unsaving post:', error)
    return NextResponse.json(
      { error: 'Failed to unsave post' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)

    // ---------- Lightweight saved-state check for a batch of post ids ----------
    const postIdsParam = searchParams.get('postIds')
    if (postIdsParam) {
      const postIds = postIdsParam.split(',').filter(id => id.trim())
      const saved = {}
      if (postIds.length > 0) {
        const userSaves = await prismaSocial.saves.findMany({
          where: { user_id: user.id, post_id: { in: postIds } },
          select: { post_id: true },
        })
        userSaves.forEach(save => {
          saved[save.post_id] = true
        })
      }
      const result = {}
      postIds.forEach(id => {
        result[id] = !!saved[id]
      })
      return NextResponse.json({ saved: result }, { status: 200 })
    }

    // ---------- Full saved-posts list for the current user ----------
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100)

    const total = await prismaSocial.saves.count({
      where: { user_id: user.id }
    })

    const saves = await prismaSocial.saves.findMany({
      where: { user_id: user.id },
      include: {
        posts: {
          include: { posts_analytics: true }
        }
      },
      orderBy: { saved_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const savedPosts = await hydratePosts(saves.map(save => save.posts))

    // Attach per-post extra flags (savedAt + liked state) for rich profile UIs
    const likedPostIds = await prismaSocial.likes.findMany({
      where: { user_id: user.id },
      select: { post_id: true },
    })
    const likedSet = new Set(likedPostIds.map(l => l.post_id))

    const result = savedPosts.map((post, idx) => ({
      ...post,
      saved: true,
      savedAt: saves[idx]?.saved_at ?? null,
      liked: likedSet.has(post.id),
    }))

    return NextResponse.json(
      {
        saves: result,
        total,
        page,
        limit,
        hasMore: (page - 1) * limit + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching saved posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved posts' },
      { status: 500 }
    )
  }
}
