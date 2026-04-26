import { NextResponse } from 'next/server'
import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters()
    return NextResponse.json(authParams)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate auth parameters' }, { status: 500 })
  }
}
