import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

/**
 * GET /api/servers
 * Fetch user's servers
 */
export async function GET(req) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to GET /api/servers')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    console.log(`[API] GET /api/servers - userId: ${userId}`)

    // TODO: Implement when Server model is created
    // For now, return empty array as servers feature is not yet implemented
    const servers = []

    return NextResponse.json({
      servers,
      pagination: {
        limit: 20,
        offset: 0,
        total: 0
      }
    })
  } catch (error) {
    console.error('[API] Error fetching servers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/servers
 * Create a new server
 * Body: { name: string, description?: string, icon?: string }
 */
export async function POST(req) {
  try {
    // Authentication check
    const session = await getServerSession()
    if (!session?.user?.id) {
      console.log('[API] Unauthorized access attempt to POST /api/servers')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await req.json()

    // Validate required fields
    const { name } = body
    if (!name || typeof name !== 'string') {
      console.log('[API] POST /api/servers - missing or invalid name')
      return NextResponse.json({ error: 'Server name required' }, { status: 400 })
    }

    // Validate name length
    if (name.trim().length === 0 || name.length > 100) {
      console.log('[API] POST /api/servers - invalid name length')
      return NextResponse.json({ error: 'Server name must be 1-100 characters' }, { status: 400 })
    }

    console.log(`[API] POST /api/servers - userId: ${userId}, name: ${name}`)

    // TODO: Implement when Server model is created
    // For now, return error that servers feature is not yet implemented
    return NextResponse.json(
      { error: 'Server creation not yet implemented' },
      { status: 501 }
    )
  } catch (error) {
    console.error('[API] Error creating server:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
