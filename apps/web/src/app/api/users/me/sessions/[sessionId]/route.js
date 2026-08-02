import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

/**
 * DELETE /api/users/me/sessions/[sessionId]
 * End a specific session (logout from device)
 */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Mock deletion - in production, would invalidate session in database
    console.log(`[API] Ending session ${sessionId} for user ${session.user.id}`)

    return NextResponse.json({ message: 'Session ended successfully' })
  } catch (error) {
    console.error('[API] Error ending session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
