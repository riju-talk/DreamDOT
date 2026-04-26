import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await request.json()

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { email: session.user.email } })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (user.id === targetUserId) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })

    const existingFollow = await prisma.following.findFirst({
      where: {
        follower_id: user.id,
        followee_id: targetUserId,
      },
    })

    if (existingFollow) return NextResponse.json({ error: 'Already following' }, { status: 400 })

    const follow = await prisma.following.create({
      data: {
        follower_id: user.id,
        followee_id: targetUserId,
      },
    })

    return NextResponse.json({ success: true, follow }, { status: 201 })
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetUserId } = await request.json()

    if (!targetUserId) return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })

    const user = await prisma.users.findUnique({ where: { email: session.user.email } })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.following.deleteMany({
      where: {
        follower_id: user.id,
        followee_id: targetUserId,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Unfollow error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
