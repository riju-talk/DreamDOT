import { NextRequest, NextResponse } from 'next/server'
import { prismaUser } from '@/lib/prisma/user'
import { validateEmail, validateUsername } from '@/lib/auth-validation'

export async function GET(request) {
  const field = request.nextUrl.searchParams.get('field')
  const rawValue = request.nextUrl.searchParams.get('value') ?? ''

  if (field !== 'email' && field !== 'username') {
    return NextResponse.json(
      { error: "Invalid field. Use 'email' or 'username'." },
      { status: 400 }
    )
  }

  const value = rawValue.trim().toLowerCase()
  if (!value) {
    return NextResponse.json(
      {
        field,
        value,
        available: false,
        error: `${field} is required`,
      },
      { status: 400 }
    )
  }

  if (field === 'email') {
    const validation = validateEmail(value)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          field,
          value,
          available: false,
          error: validation.error,
        },
        { status: 400 }
      )
    }

    const user = await prismaUser.users.findUnique({
      where: { email: value },
      select: { id: true },
    })

    return NextResponse.json({
      field,
      value,
      available: !user,
    })
  }

  const validation = validateUsername(value)
  if (!validation.isValid) {
    return NextResponse.json(
      {
        field,
        value,
        available: false,
        error: validation.error,
      },
      { status: 400 }
    )
  }

  const profile = await prismaUser.user_profile.findUnique({
    where: { username: value },
    select: { user_id: true },
  })

  return NextResponse.json({
    field,
    value,
    available: !profile,
  })
}
