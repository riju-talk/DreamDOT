import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma as prismaUser } from "@/generated/user"
import { prisma as prismaSocial } from "@/generated/social"
import { prisma as prismaItem } from "@/generated/item"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret"

export async function GET(req, { params }) {
  const user_id = params.user_id    

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
  }

  // 🔐 Check JWT token if provided
  const authHeader = req.headers.get("authorization")
  let isOwner = false

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      isOwner = decoded.id === user_id
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  }

  try {
    // 📦 Pull user and profile details
    const [user, profile, followers, following, posts, items] = await Promise.all([
      prismaUser.users.findUnique({ where: { id: user_id } }),
      prismaUser.user_profile.findUnique({ where: { user_id } }),
      prismaSocial.following.findMany({ where: { followee_id: user_id } }),
      prismaSocial.following.findMany({ where: { follower_id: user_id } }),
      prismaSocial.posts.findMany({
        where: { user_id },
        orderBy: { created_at: "desc" },
        take: 10,
      }),
      prismaItem.items.findMany({
        where: { user_id },
        take: 10,
      }),
    ])

    const profile_data = {
      username: profile?.username,
      display_name: profile?.display_name,
      avatar_url: profile?.avatar_url,
      banner_url: profile?.banner_url ?? null,
      bio: profile?.bio ?? null,
      location: profile?.country ?? null,
      website: profile?.website ?? null,
      social_links: profile?.social_links ?? {},
      dob: profile?.dob ?? null,
      followers: followers.length,
      following: following.length,
      join_date: user?.created_at,
    }

    return NextResponse.json({
      profile: profile_data,
      posts,
      items,
      isOwner,
    })
  } catch (err) {
    console.error("Failed to fetch user account details:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
