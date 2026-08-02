import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prismaUser } from '@/lib/prisma_user';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { isFollowing: false },
        { status: 200 }
      );
    }

    const { userId } = await params;

    const currentUser = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser || currentUser.id === userId) {
      return NextResponse.json(
        { isFollowing: false },
        { status: 200 }
      );
    }

    const follow = await prismaUser.following.findFirst({
      where: {
        follower_id: currentUser.id,
        followee_id: userId,
      },
    });

    return NextResponse.json(
      { isFollowing: !!follow },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json(
      { isFollowing: false },
      { status: 200 }
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = await params;

    const currentUser = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    const existingFollow = await prismaUser.following.findFirst({
      where: {
        follower_id: currentUser.id,
        followee_id: userId,
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following' },
        { status: 400 }
      );
    }

    const follow = await prismaUser.following.create({
      data: {
        follower_id: currentUser.id,
        followee_id: userId,
      },
    });

    return NextResponse.json(
      { success: true, follow },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = await params;

    const currentUser = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await prismaUser.following.deleteMany({
      where: {
        follower_id: currentUser.id,
        followee_id: userId,
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
