import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

export async function GET(_request, { params }) {
  try {
    const { communityId } = await params

    // Fetch all members of the community
    const members = await prismaCommunity.members.findMany({
      where: { server_id: communityId },
    })

    // Get user details for each member
    const userIds = members.map((m) => m.user_id)
    const users = await prismaUser.users.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        email: true,
        is_verified: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            avatar_url: true,
          },
        },
      },
    })

    const usersMap = new Map(users.map((u) => [u.id, u]))

    const memberList = members.map((member) => {
      const user = usersMap.get(member.user_id)
      return {
        id: member.member_id,
        userId: member.user_id,
        username: user?.user_profile?.username || user?.email || 'Unknown',
        displayName: user?.user_profile?.display_name || null,
        avatar: user?.user_profile?.avatar_url || null,
        role: member.role,
        verified: user?.is_verified || false,
        joinedAt: member.joined_at,
      }
    })

    return NextResponse.json({ members: memberList }, { status: 200 })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
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

    const { communityId } = await params
    const { userId, role = 'member' } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verify current user is owner/admin
    const currentMembership = await prismaCommunity.members.findUnique({
      where: {
        server_id_user_id: {
          server_id: communityId,
          user_id: currentUser.id,
        },
      },
    })

    if (!currentMembership || !['owner', 'admin'].includes(currentMembership.role)) {
      return NextResponse.json({ error: 'Not authorized to add members' }, { status: 403 })
    }

    // Add member
    const newMember = await prismaCommunity.members.create({
      data: {
        server_id: communityId,
        user_id: userId,
        role,
      },
    })

    // Get user details
    const user = await prismaUser.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        is_verified: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            avatar_url: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        member: {
          id: newMember.member_id,
          userId: newMember.user_id,
          username: user?.user_profile?.username || user?.email || 'Unknown',
          displayName: user?.user_profile?.display_name || null,
          avatar: user?.user_profile?.avatar_url || null,
          role: newMember.role,
          verified: user?.is_verified || false,
          joinedAt: newMember.joined_at,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    // Handle unique constraint (user already member)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User is already a member' }, { status: 409 })
    }
    console.error('Error adding member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
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

    const { communityId } = await params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verify current user is owner/admin
    const currentMembership = await prismaCommunity.members.findUnique({
      where: {
        server_id_user_id: {
          server_id: communityId,
          user_id: currentUser.id,
        },
      },
    })

    if (!currentMembership || !['owner', 'admin'].includes(currentMembership.role)) {
      return NextResponse.json({ error: 'Not authorized to remove members' }, { status: 403 })
    }

    // Remove member
    await prismaCommunity.members.deleteMany({
      where: {
        server_id: communityId,
        user_id: userId,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
