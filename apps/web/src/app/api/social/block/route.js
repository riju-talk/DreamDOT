import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@/generated/social/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { targetUserId } = await request.json()

    if (!targetUserId) return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })

    const user = await prisma.users.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (user.id === targetUserId) {
      return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 })
    }

    const existingBlock = await prisma.blocking.findFirst({
      where: {
        blocker_id: user.id,
        blocked_id: targetUserId,
      },
    })

    if (existingBlock) return NextResponse.json({ error: 'Already blocked' }, { status: 400 })

    await prisma.following.deleteMany({
      where: {
        OR: [
          { follower_id: user.id, followee_id: targetUserId },
          { follower_id: targetUserId, followee_id: user.id },
        ],
      },
    })

    const block = await prisma.blocking.create({
      data: {
        blocker_id: user.id,
        blocked_id: targetUserId,
      },
    })

    return NextResponse.json({ success: true, block }, { status: 201 })
  } catch (error) {
    console.error('Block error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { targetUserId } = await request.json()

    if (!targetUserId) return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })

    const user = await prisma.users.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.blocking.deleteMany({
      where: {
        blocker_id: user.id,
        blocked_id: targetUserId,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Unblock error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
