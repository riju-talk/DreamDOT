import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

    if (!privateKey) {
      console.error('IMAGEKIT_PRIVATE_KEY not configured')
      return NextResponse.json(
        { error: 'ImageKit not properly configured' },
        { status: 500 }
      )
    }

    const token = crypto.randomBytes(16).toString('hex')
    const expire = Math.floor(Date.now() / 1000) + 3600 // 1 hour
    const auth = token + expire
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(auth)
      .digest('hex')

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
      urlEndpoint,
    })
  } catch (error) {
    console.error('ImageKit auth error:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth parameters' },
      { status: 500 }
    )
  }
}

