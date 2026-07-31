import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fallback for development - using fake auth params
    const authParams = {
      token: 'fake_token_' + Date.now(),
      signature: 'fake_signature_' + Math.random().toString(36).substring(7),
      expire: Math.floor(Date.now() / 1000) + 3600,
    }
    return NextResponse.json(authParams)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate auth parameters' }, { status: 500 })
  }
}

