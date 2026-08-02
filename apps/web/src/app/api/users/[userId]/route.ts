import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prismaUser } from '@/lib/prisma_user';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prismaUser.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            avatar_url: true,
            bio: true,
            location: true,
            website: true,
            social_links: true,
          },
        },
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get follower/following counts
    const followerCount = await prismaUser.following.count({
      where: { followee_id: userId },
    });

    const followingCount = await prismaUser.following.count({
      where: { follower_id: userId },
    });

    // Check if current user is following this user
    const session = await getServerSession(authOptions);
    let isFollowing = false;

    if (session?.user?.email) {
      const currentUser = await prismaUser.users.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });

      if (currentUser && currentUser.id !== userId) {
        const follow = await prismaUser.following.findFirst({
          where: {
            follower_id: currentUser.id,
            followee_id: userId,
          },
        });
        isFollowing = !!follow;
      }
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          ...user.user_profile,
          followerCount,
          followingCount,
          joinDate: user.created_at,
        },
        isFollowing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
