// app/api/auth/signin/route.ts
import { NextResponse } from "next/server"
import { prismaUser } from "@/lib/prisma/user"
import bcrypt from "bcryptjs"
import { signJwt } from "@/lib/jwt"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    // 1) Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // 2) Find user + profile
    const user = await prismaUser.users.findUnique({
      where: { email: email.toLowerCase() },
      include: { user_profile: true },
    })

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 3) Reject OAuth-only accounts
    if (user.password_hash.startsWith("OAUTH_LOGIN_")) {
      return NextResponse.json(
        { error: "This account uses OAuth sign-in. Please use the OAuth provider." },
        { status: 401 }
      )
    }

    // 4) Verify password
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 5) Optional: block unverified accounts
    if (!user.is_verified) {
      return NextResponse.json({ error: "Please verify your email first" }, { status: 403 })
    }

    // 6) Return success with user info
    return NextResponse.json({
      message: "Sign-in successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.user_profile?.display_name,
        username: user.user_profile?.username,
        avatar: user.user_profile?.avatar_url,
      },
    })
  } catch (error) {
    console.error("Sign-in error:", error)
    return NextResponse.json({ error: "An error occurred during sign-in" }, { status: 500 })
  }
}
