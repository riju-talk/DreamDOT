import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { User } from '@repo/database-mongo'

/**
 * GET /api/users/me/integrations
 * Fetch connected integrations
 */
export async function GET(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const user = await User.findById(session.user.id).lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Format Meta accounts
    const metaAccounts = (user.connectedServices?.metaAccounts || []).map((account, idx) => ({
      id: `meta_${idx}`,
      name: 'Meta',
      connected: true,
      account: account,
      connectedAt: new Date().toLocaleDateString(),
    }))

    // Format Web3 wallets
    const web3Wallets = (user.connectedServices?.web3Wallets || []).map((wallet, idx) => ({
      id: `web3_${idx}`,
      name: 'Web3 Wallet',
      connected: true,
      account: wallet.slice(0, 6) + '...' + wallet.slice(-4),
      connectedAt: new Date().toLocaleDateString(),
    }))

    return NextResponse.json({
      metaAccounts,
      web3Wallets,
    })
  } catch (error) {
    console.error('[API] Error fetching integrations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
