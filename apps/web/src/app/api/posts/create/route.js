import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prismaSocial } from "@/lib/prisma/social"
import { prismaUser } from "@/lib/prisma/user"
import { connectToDatabase } from "@/lib/mongoose/connection"

// Helper function to validate user authentication
async function validateUser(request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.name) {
      return {
        email: session.user.email || "",
        name: session.user.name || ""
      }
    }

    const authorization = request.headers.get("Authorization")
    if (!authorization?.startsWith("Bearer ")) {
      return null
    }

    const decoded = { email: session?.user?.email || "", name: session?.user?.name || "" }

    if (!decoded) {
      return null
    }

    return {
      email: decoded.email,
      name: decoded.name
    }
  } catch (error) {
    console.error("Error validating user:", error)
    return null
  }
}

// Helper function to validate and sanitize input
function validateInput(data) {
  const errors = []

  if (!data.content || typeof data.content !== "string") {
    errors.push("Content is required and must be a string")
  } else if (data.content.trim().length === 0) {
    errors.push("Content cannot be empty")
  } else if (data.content.length > 5000) {
    errors.push("Content cannot exceed 5000 characters")
  }

  if (data.visibility && ![true, false].includes(data.visibility)) {
    errors.push("Invalid visibility setting")
  }

  if (data.mediaType && !["text", "image", "video", "audio"].includes(data.mediaType)) {
    errors.push("Invalid media type")
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    cleanData: {
      content: data.content.trim(),
      mediaUrl: data.mediaUrl,
      visibility: data.visibility || "public",
      mediaType: data.mediaType || "text"
    }
  }
}

// Helper function to create post analytics entry
async function createPostAnalytics(postId) {
  try {
    await prismaSocial.posts_analytics.create({
      data: {
        post_id: postId,
        views_count: 0,
        likes_count: 0,
        comments_count: 0,
        updated_at: new Date()
      }
    })
  } catch (error) {
    console.error("Failed to create post analytics:", error)
  }
}

// Helper function to update user analytics
async function updateUserAnalytics(userId) {
  try {
    const userAnalytics = await prismaSocial.user_analytics.findUnique({
      where: { user_id: userId }
    })

    if (userAnalytics) {
      await prismaSocial.user_analytics.update({
        where: { user_id: userId },
        data: {
          posts_count: {
            increment: 1
          }
        }
      })
    } else {
      await prismaSocial.user_analytics.create({
        data: {
          user_id: userId,
          posts_count: 1,
          likes_received: 0,
          followers_count: 0,
          following_count: 0,
          activity_score: 1.0
        }
      })
    }
  } catch (error) {
    console.error("Failed to update user analytics:", error)
  }
}

export async function POST(request) {
  try {
    const user = await validateUser(request)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          code: "UNAUTHORIZED"
        },
        { status: 401 }
      )
    }

    let requestData
    try {
      const rawBody = await request.text()
      requestData = JSON.parse(rawBody)
    } catch (error) {
      console.error("Error parsing request body:", error.message)
      return NextResponse.json(
        {
          success: false,
          message: `Invalid JSON in request body: ${error.message}`,
          code: "INVALID_JSON"
        },
        { status: 400 }
      )
    }

    const validation = validateInput(requestData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
          code: "VALIDATION_ERROR"
        },
        { status: 400 }
      )
    }

    const { content, mediaUrl, visibility, mediaType } = validation.cleanData

    const dbUser = await prismaUser.users.findUnique({
      where: { email: user.email },
      select: { id: true }
    })

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          code: "USER_NOT_FOUND"
        },
        { status: 404 }
      )
    }

    const postMetadata = await prismaSocial.posts.create({
      data: {
        user_id: dbUser.id,
        sql_id: `post_${Date.now()}`,
        description: content.substring(0, 500),
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    const sqlId = postMetadata.id
    console.log(`✅ SQL metadata created - ID: ${sqlId}`)

    createPostAnalytics(postMetadata.id)
    updateUserAnalytics(dbUser.id)

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      data: {
        postId: postMetadata.id,
        content: postMetadata.description,
        visibility: visibility,
        createdAt: postMetadata.created_at,
        user: {
          id: dbUser.id,
          name: user.name,
          email: user.email
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating post:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    })

    if (error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          message: "Post already exists",
          code: "DUPLICATE_POST"
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error occurred while creating post",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const user = await validateUser(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50)
    
    const dbUser = await prismaUser.users.findUnique({
      where: { email: user.email },
      select: { id: true }
    })

    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    const posts = await prismaSocial.posts.findMany({
      where: { user_id: dbUser.id },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prismaSocial.posts.count({ where: { user_id: dbUser.id } })

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          hasMore: (page * limit) < total
        }
      }
    })

  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
