import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'

export async function POST(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await params

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

    // Save post
    await prismaSocial.saves.create({
      data: {
        user_id: currentUser.id,
        post_id: postId,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    // Handle unique constraint violation (already saved)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already saved' }, { status: 409 })
    }
    console.error('Error saving post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await params

    // Get current user ID
    const currentUser = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove save
    const save = await prismaSocial.saves.deleteMany({
      where: {
        user_id: currentUser.id,
        post_id: postId,
      },
    })

    if (save.count === 0) {
      return NextResponse.json({ error: 'Save not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error removing save:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
