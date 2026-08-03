import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prismaUser } from "@/lib/prisma/user"

// Helper function to get user with profile (reusable)
async function getUserWithProfile(email) {
  return await prismaUser.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      user_profile: {
        select: {
          username: true,
          display_name: true,
          bio: true,
          dob: true,
          country: true,
          website: true,
          social_links: true,
          avatar_url: true,
          banner_url: true,
        },
      },
    },
  })
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserWithProfile(session.user.email)

    if (!user || !user.user_profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const { fields, data } = body

    if (!Array.isArray(fields) || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const allowedFields = [
      "username", "display_name", "bio", "dob",
      "country", "website", "social_links",
      "avatar_url", "banner_url",
    ]

    const updates = {}

    for (const field of fields) {
      if (!allowedFields.includes(field)) {
        return NextResponse.json({ error: `Field not allowed: ${field}` }, { status: 400 })
      }

      // Convert "dob" to a valid Date object
      if (field === "dob") {
        try {
          const dateObj = new Date(data.dob)
          if (isNaN(dateObj.getTime())) {
            return NextResponse.json({ error: "Invalid date format for dob" }, { status: 400 })
          }
          updates.dob = dateObj
        } catch (err) {
          return NextResponse.json({ error: "Invalid dob format" }, { status: 400 })
        }
      } else {
        updates[field] = data[field]
      }
    }

    // Update profile in database
    const updatedProfile = await prismaUser.user_profile.update({
      where: { user_id: user.id },
      data: updates,
    })

    return NextResponse.json({ 
      success: true, 
      updated: updates,
      profile: {
        username: updatedProfile.username,
        display_name: updatedProfile.display_name,
        bio: updatedProfile.bio,
        dob: updatedProfile.dob,
        country: updatedProfile.country,
        website: updatedProfile.website,
        social_links: updatedProfile.social_links || [],
        avatar_url: updatedProfile.avatar_url,
        banner_url: updatedProfile.banner_url,
      },
    })
  } catch (err) {
    console.error("[PATCH /api/settings] Error:", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserWithProfile(session.user.email)
    
    if (!user || !user.user_profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        profile: {
          email: user.email,
          username: user.user_profile.username,
          display_name: user.user_profile.display_name,
          bio: user.user_profile.bio,
          dob: user.user_profile.dob,
          country: user.user_profile.country,
          website: user.user_profile.website,
          social_links: user.user_profile.social_links || [],
          avatar_url: user.user_profile.avatar_url,
          banner_url: user.user_profile.banner_url,
        },
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (err) {
    console.error("[GET /api/settings] Error:", err)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}