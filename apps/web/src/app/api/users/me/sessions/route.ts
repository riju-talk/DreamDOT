import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prismaUser } from '@/lib/prisma_user';

interface Session {
  id: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  lastActive: Date;
  isCurrent: boolean;
}

export async function GET(request: Request) {
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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mock sessions - in a real app, you'd track actual sessions in database
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';

    const sessions: Session[] = [
      {
        id: 'current',
        deviceName: 'Current Device',
        ipAddress: ipAddress as string,
        userAgent: userAgent as string,
        lastActive: new Date(),
        isCurrent: true,
      },
    ];

    return NextResponse.json(
      { sessions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
