import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

/**
 * GET /api/servers/[id]/channels
 * Fetch channels for a server (TEXT ONLY)
 * Query params: limit=20, offset=0
 */
export async function GET(req, { params }) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to GET /api/servers/[id]/channels')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serverId = params.id
    const userId = session.user.id

    // Validate serverId
    if (!serverId) {
      console.log('[API] GET /api/servers/[id]/channels - missing serverId')
      return NextResponse.json({ error: 'Server ID required' }, { status: 400 })
    }

    console.log(`[API] GET /api/servers/[id]/channels - serverId: ${serverId}, userId: ${userId}`)

    // TODO: Implement when Server and Channel models are created
    // For now, return empty array as servers feature is not yet implemented
    // CRITICAL: Must filter channels to TEXT type only - no voice or stage channels
    const textChannels = []

    return NextResponse.json({
      channels: textChannels,
      pagination: {
        limit: 20,
        offset: 0,
        total: 0
      }
    })
  } catch (error) {
    console.error('[API] Error fetching channels:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
