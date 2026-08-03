import { NextResponse } from 'next/server'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaItems } from '@/lib/prisma/items'
import { prismaUser } from '@/lib/prisma/user'
import { connectToDatabase } from '@/lib/mongoose/connection'
import { Post } from '@repo/database-mongo'

export async function GET() {
  const debug = {}

  // Test PostgreSQL - Social
  try {
    const socialPostsCount = await prismaSocial.posts.count()
    debug.postgresSocial = { connected: true, postsCount: socialPostsCount }
  } catch (error) {
    debug.postgresSocial = { connected: false, error: error.message }
  }

  // Test PostgreSQL - Items
  try {
    const itemsCount = await prismaItems.items.count()
    debug.postgresItems = { connected: true, itemsCount }
  } catch (error) {
    debug.postgresItems = { connected: false, error: error.message }
  }

  // Test PostgreSQL - User
  try {
    const usersCount = await prismaUser.users.count()
    debug.postgresUser = { connected: true, usersCount }
  } catch (error) {
    debug.postgresUser = { connected: false, error: error.message }
  }

  // Test MongoDB
  try {
    await connectToDatabase()
    const postsCount = await Post.countDocuments()
    debug.mongodb = { connected: true, postsCount }
  } catch (error) {
    debug.mongodb = { connected: false, error: error.message }
  }

  return NextResponse.json(debug)
}
