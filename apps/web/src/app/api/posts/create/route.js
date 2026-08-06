import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prismaSocial } from "@/lib/prisma/social"
import { prismaUser } from "@/lib/prisma/user"
import { connectToDatabase } from "@/lib/mongoose/connection"
import { Post } from "@repo/database-mongo"

// Helper function to validate user authentication
async function validateUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
      return null
    }

    return {
      email: session.user.email || "",
      name: session.user.name || ""
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

  if (data.visibility !== undefined && typeof data.visibility !== "boolean") {
    errors.push("Invalid visibility setting")
  }

  let media = []
  if (data.media !== undefined && data.media !== null) {
    if (!Array.isArray(data.media)) {
      errors.push("Invalid media format")
    } else {
      if (data.media.length > 5) {
        errors.push("Cannot attach more than 5 images")
      }
      for (const item of data.media) {
        if (!item || typeof item !== "object" || !item.type || !item.url) {
          errors.push("Each media item must have a type and url")
          break
        }
        if (!["text", "image", "video", "audio"].includes(item.type)) {
          errors.push(`Invalid media type: ${item.type}`)
          break
        }
      }
      media = data.media.map(({ type, url, alt }) => ({ type, url, alt }))
    }
  } else if (data.mediaUrl) {
    media = [{ type: data.mediaType || "image", url: data.mediaUrl }]
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    cleanData: {
      content: data.content.trim(),
      media,
      visibility: data.visibility ?? true
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
    const user = await validateUser()
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

    const { content, media, visibility } = validation.cleanData

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

    // STEP 1: Create PostgreSQL metadata first (id + sql_id must match the Mongo link)
    const postId = crypto.randomUUID()

    const postMetadata = await prismaSocial.posts.create({
      data: {
        id: postId,
        user_id: dbUser.id,
        sql_id: postId,
        content: content,
        visibility: visibility,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    console.log(`✅ SQL metadata created - ID: ${postMetadata.id}`)

    // STEP 2: Create MongoDB post (actual content + media), linked via sqlId
    try {
      await connectToDatabase()

      const newPost = new Post({
        userId: dbUser.id,
        sqlId: postId,
        content: content,
        media: media,
        visibility: visibility,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [],
        comments: [],
        shares: 0,
        saves: [],
        category: "general",
        tags: [],
        engagementScore: 0,
        isSponsored: false
      })

      await newPost.save()
      console.log(`✅ MongoDB post created - sqlId: ${postId}`)
    } catch (mongoError) {
      console.error("MongoDB post creation failed, rolling back SQL metadata:", mongoError)
      await prismaSocial.posts.delete({ where: { id: postId } }).catch(() => {})
      throw mongoError
    }

    createPostAnalytics(postMetadata.id)
    updateUserAnalytics(dbUser.id)

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      data: {
        postId: postMetadata.id,
        content: content,
        visibility: visibility,
        media: media,
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
