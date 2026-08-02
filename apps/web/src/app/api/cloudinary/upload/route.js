import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * POST /api/cloudinary/upload
 * Upload a file to Cloudinary
 * 
 * Request body (multipart/form-data):
 * - file: File to upload
 * - folder: Optional folder name (default: 'dreamdot')
 * - resourceType: Optional resource type (default: 'auto')
 */
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary API credentials not configured')
      return NextResponse.json(
        { error: 'Upload service not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'dreamdot'
    const resourceType = formData.get('resourceType') || 'auto'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (max 100MB)
    const arrayBuffer = await file.arrayBuffer()
    if (arrayBuffer.byteLength > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 100MB limit' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(arrayBuffer)
    const filename = `${Date.now()}-${file.name}`

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: filename.split('.')[0],
          overwrite: false,
          quality: 'auto',
          eager: [
            { width: 300, height: 300, crop: 'thumb' },
            { width: 800, height: 600, crop: 'scale' },
          ],
        },
        (error, uploadResult) => {
          if (error) {
            reject(error)
          } else {
            resolve(uploadResult)
          }
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      resourceType: result.resource_type,
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json(
      {
        error: 'Upload failed',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cloudinary/upload
 * Get Cloudinary signature for unsigned uploads
 */
export async function GET() {
  try {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary not configured' },
        { status: 500 }
      )
    }

    const timestamp = Math.round(new Date().getTime() / 1000)
    const paramsToSign = {
      timestamp,
      folder: 'dreamdot',
      resource_type: 'auto',
    }

    // Sort params alphabetically
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .reduce((acc, key) => {
        acc.push(`${key}=${paramsToSign[key]}`)
        return acc
      }, [])
      .join('&')

    const signature = crypto
      .createHash('sha256')
      .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
      .digest('hex')

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    })
  } catch (error) {
    console.error('Cloudinary signature error:', error)
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    )
  }
}
