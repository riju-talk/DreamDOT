import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prismaUser } from "@/lib/prisma/user"

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        phone: true,
        user_profile: {
          select: {
            username: true,
            display_name: true,
            bio: true,
            dob: true,
            country: true,
            website: true,
            avatar_url: true,
            banner_url: true,
          },
        },
      },
    })
    
    if (!user || !user.user_profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      email: user.email,
      phone: user.phone || "",
      username: user.user_profile.username,
      display_name: user.user_profile.display_name || "",
      bio: user.user_profile.bio || "",
      dob: user.user_profile.dob,
      country: user.user_profile.country || "",
      website: user.user_profile.website || "",
      avatar_url: user.user_profile.avatar_url,
      banner_url: user.user_profile.banner_url,
    })
  } catch (err) {
    console.error("[GET /api/settings/account] Error:", err)
    return NextResponse.json({ error: "Failed to fetch account settings" }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      displayName,
      username,
      email,
      phone,
      bio,
      website,
      country,
      dob,
    } = body

    const user = await prismaUser.users.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if new email is already taken
    if (email && email !== user.email) {
      const existingEmail = await prismaUser.users.findUnique({
        where: { email },
      })
      if (existingEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }
    }

    // Check if new username is already taken
    if (username && username !== user.user_profile?.username) {
      const existingUsername = await prismaUser.user_profile.findUnique({
        where: { username },
      })
      if (existingUsername) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 })
      }
    }

    // Check if new phone is already taken
    if (phone && phone !== user.phone) {
      const existingPhone = await prismaUser.users.findUnique({
        where: { phone },
      })
      if (existingPhone) {
        return NextResponse.json({ error: "Phone number already in use" }, { status: 400 })
      }
    }

    // Prepare user profile updates
    const profileUpdates = {}
    if (displayName !== undefined) profileUpdates.display_name = displayName
    if (username !== undefined) profileUpdates.username = username
    if (bio !== undefined) profileUpdates.bio = bio
    if (website !== undefined) profileUpdates.website = website
    if (country !== undefined) profileUpdates.country = country
    if (dob !== undefined) {
      profileUpdates.dob = dob ? new Date(dob) : null
    }

    // Prepare user updates
    const userUpdates = {}
    if (email !== undefined) userUpdates.email = email
    if (phone !== undefined) userUpdates.phone = phone || null

    // Update user if needed
    if (Object.keys(userUpdates).length > 0) {
      await prismaUser.users.update({
        where: { id: user.id },
        data: userUpdates,
      })
    }

    // Update user_profile if needed
    let updatedProfile = user.user_profile
    if (Object.keys(profileUpdates).length > 0) {
      updatedProfile = await prismaUser.user_profile.update({
        where: { user_id: user.id },
        data: profileUpdates,
      })
    }

    return NextResponse.json({
      success: true,
      email: email || user.email,
      phone: phone || user.phone,
      username: updatedProfile.username,
      display_name: updatedProfile.display_name,
      bio: updatedProfile.bio,
      dob: updatedProfile.dob,
      country: updatedProfile.country,
      website: updatedProfile.website,
    })
  } catch (err) {
    console.error("[PUT /api/settings/account] Error:", err)
    return NextResponse.json({ error: "Failed to update account settings" }, { status: 500 })
  }
}
