import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { User } from '@repo/database-mongo'

/**
 * DELETE /api/users/me/integrations/[id]
 * Disconnect an integration
 */
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type } = body
    const { id } = params

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    await connectToDatabase()
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove from appropriate list
    if (type === 'meta') {
      if (user.connectedServices?.metaAccounts) {
        user.connectedServices.metaAccounts = user.connectedServices.metaAccounts.filter(
          (_, idx) => `meta_${idx}` !== id
        )
      }
    } else if (type === 'web3') {
      if (user.connectedServices?.web3Wallets) {
        user.connectedServices.web3Wallets = user.connectedServices.web3Wallets.filter(
          (_, idx) => `web3_${idx}` !== id
        )
      }
    }

    await user.save()

    return NextResponse.json({ message: 'Integration disconnected successfully' })
  } catch (error) {
    console.error('[API] Error disconnecting integration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
