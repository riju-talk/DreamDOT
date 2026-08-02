import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

/**
 * GET /api/users/me/sessions
 * Fetch active sessions for current user
 */
export async function GET(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock sessions data - in production, would query database
    const sessions = [
      {
        id: 'session_1',
        device: 'Chrome on Windows',
        ip: '192.168.1.1',
        lastActive: new Date().toISOString(),
        current: true,
      },
      {
        id: 'session_2',
        device: 'Safari on macOS',
        ip: '192.168.1.2',
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        current: false,
      },
    ]

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('[API] Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
