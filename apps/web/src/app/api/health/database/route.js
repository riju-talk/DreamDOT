import { NextResponse } from 'next/server'
import { prismaUser } from '@/lib/prisma/user'
import { prismaSocial } from '@/lib/prisma/social'
import { prismaItems } from '@/lib/prisma/items'

export async function GET() {
  try {
    const results = await Promise.allSettled([
      prismaUser.$queryRaw`SELECT 1`,
      prismaSocial.$queryRaw`SELECT 1`,
      prismaItem.$queryRaw`SELECT 1`,
    ])

    const dbNames = ['user', 'social', 'items']
    const errors = results
      .map((result, index) => ({ result, index }))
      .filter((row) => row.result.status === 'rejected')
      .map((row) => ({
        database: dbNames[row.index],
        error: row.result.reason?.message || 'Unknown connection error',
      }))

    const status = {
      user: results[0].status === 'fulfilled' ? 'connected' : 'error',
      social: results[1].status === 'fulfilled' ? 'connected' : 'error',
      items: results[2].status === 'fulfilled' ? 'connected' : 'error',
      timestamp: new Date().toISOString(),
      errors,
    }

    const hasErrors = errors.length > 0

    return NextResponse.json(
      {
        status: hasErrors ? 'error' : 'healthy',
        message: hasErrors ? 'Some database connections failed' : 'All databases connected successfully',
        ...status,
      },
      { status: hasErrors ? 500 : 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
