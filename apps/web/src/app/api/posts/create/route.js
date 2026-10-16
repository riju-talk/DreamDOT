import { NextResponse } from "next/server"
import { createPost } from "@/lib/services/posts"
import { errorResponse, getSessionUserId, unauthorized } from "@/lib/services/http"

const MEDIA_TYPES = ["text", "image", "video", "audio"]

/** Accept the legacy `media[]` shape or a single `mediaUrl`; throws nothing, returns null if malformed. */
function parseMedia(data) {
  if (Array.isArray(data.media)) {
    const ok = data.media.every((m) => m && m.url && MEDIA_TYPES.includes(m.type))
    return ok ? data.media.map(({ type, url, alt }) => ({ type, url, alt })) : null
  }
  if (data.media != null) return null
  return data.mediaUrl ? [{ type: data.mediaType || "image", url: data.mediaUrl }] : []
}

/** POST /api/posts/create — REST twin of the GraphQL `createPost` mutation (same service). */
export async function POST(request) {
  try {
    const userId = await getSessionUserId()
    if (!userId) return unauthorized()

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Invalid JSON in request body", code: "INVALID_JSON" }, { status: 400 })
    if (body.visibility !== undefined && typeof body.visibility !== "boolean") {
      return NextResponse.json({ error: "Invalid visibility setting", code: "VALIDATION_ERROR" }, { status: 400 })
    }
    const media = parseMedia(body)
    if (!media) return NextResponse.json({ error: "Invalid media format", code: "VALIDATION_ERROR" }, { status: 400 })

    const post = await createPost({ userId, content: body.content, media, visibility: body.visibility ?? true })

    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        data: { postId: post.id, content: post.content, visibility: post.visibility, media, createdAt: post.created_at },
      },
      { status: 201 }
    )
  } catch (err) {
    return errorResponse(err, "create post")
  }
}
