import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaUser } from '@/lib/prisma/user'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch all direct conversations (this is a simplified version)
    // In production, you might want to have a dedicated conversations table
    const allUsers = await prismaUser.users.findMany({
      where: {
        NOT: { id: currentUser.id },
      },
      select: {
        id: true,
        email: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            avatar_url: true,
          },
        },
      },
      take: 50,
    })

    const conversations = allUsers.map((user) => ({
      id: `dm_${currentUser.id}_${user.id}`,
      participantId: user.id,
      participantName: user.user_profile?.display_name || user.user_profile?.username || user.email,
      participantAvatar: user.user_profile?.avatar_url,
      lastMessage: 'No messages yet',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    }))

    return NextResponse.json({ conversations }, { status: 200 })
  } catch (error) {
    console.error('Error fetching DMs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
