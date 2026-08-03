import { NextResponse } from 'next/server'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaUser } from '@/lib/prisma/user'
import { fetchPosts } from '@/lib/mongoose/posts'

export async function GET(_request, { params }) {
  try {
    const { id: userId } = await params

    // Fetch posts
    const { posts: userPosts } = await fetchPosts({ userId, limit: 50 })

    // Fetch items (products)
    let userItems = []
    try {
      // This assumes items are stored in MongoDB or another database
      // Adjust based on your actual items implementation
      const { Item } = await import('@repo/database-mongo')
      userItems = await Item.find({ creator_id: userId }).limit(50)
    } catch (error) {
      console.warn('Could not fetch items:', error)
      userItems = []
    }

    return NextResponse.json(
      {
        posts: userPosts || [],
        items: userItems || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching user content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
