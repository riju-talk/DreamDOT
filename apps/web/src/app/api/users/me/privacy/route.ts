import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prismaUser } from '@/lib/prisma_user';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: {
        user_profile: {
          select: {
            privacy_settings: true,
          },
        },
      },
    });

    if (!user?.user_profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const privacySettings = user.user_profile.privacy_settings || {
      profileVisibility: 'public',
      showEmail: false,
      allowMessages: true,
      allowNotifications: true,
    };

    return NextResponse.json(
      { privacySettings },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { privacySettings } = body;

    if (!privacySettings) {
      return NextResponse.json(
        { error: 'Privacy settings are required' },
        { status: 400 }
      );
    }

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedProfile = await prismaUser.user_profile.update({
      where: { user_id: user.id },
      data: {
        privacy_settings: privacySettings,
      },
      select: {
        privacy_settings: true,
      },
    });

    return NextResponse.json(
      { privacySettings: updatedProfile.privacy_settings },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
