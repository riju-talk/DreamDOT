import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prismaCommunity } from '@/lib/prisma/community'
import { prismaUser } from '@/lib/prisma/user'

/**
 * POST /api/communities/[communityId]/leave
 * Self-serve leave — distinct from DELETE /members, which is an owner/admin removing
 * SOMEONE ELSE. An owner cannot leave their own community (no ownership-transfer or
 * delete-then-recreate flow exists yet); they must delete it instead (see DELETE below).
 */
export async function POST(_request, { params }) {
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

    const membership = await prismaCommunity.members.findUnique({
      where: { server_id_user_id: { server_id: communityId, user_id: currentUser.id } },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this community' }, { status: 404 })
    }

    if (membership.role === 'owner') {
      return NextResponse.json(
        { error: 'The owner cannot leave a community they own. Delete the community instead.' },
        { status: 400 }
      )
    }

    await prismaCommunity.members.deleteMany({ where: { server_id: communityId, user_id: currentUser.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error leaving community:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
