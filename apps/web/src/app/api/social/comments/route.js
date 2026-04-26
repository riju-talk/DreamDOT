import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { postId, content } = await request.json()

    if (!postId || !content) {
      return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { email: session.user.email } })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const comment = await prisma.comments.create({
      data: {
        user_id: user.id,
        post_id: postId,
        content,
      },
    })

    return NextResponse.json({ success: true, comment }, { status: 201 })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const postId = request.nextUrl.searchParams.get('postId')

    if (!postId) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })

    const comments = await prisma.comments.findMany({
      where: { post_id: postId },
      orderBy: { created_at: 'desc' },
      take: 100,
    })

    return NextResponse.json({ comments }, { status: 200 })
  } catch (error) {
    console.error('Fetch comments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { commentId } = await request.json()

    if (!commentId) return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })

    const user = await prisma.users.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const comment = await prisma.comments.findUnique({ where: { comment_id: commentId } })
    if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

    if (comment.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this comment' }, { status: 403 })
    }

    await prisma.comments.delete({ where: { comment_id: commentId } })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Comment deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
