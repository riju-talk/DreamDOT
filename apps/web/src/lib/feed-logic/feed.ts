"use server"
import { prismaSocial } from "@/lib/prisma/social"
import { prismaItems } from "@/lib/prisma/items"
import { prismaUser } from "@/lib/prisma/user"
import { connectToDatabase } from "../mongoose/connection"
import { fetchItems } from "../mongoose/items"
import { fetchPosts } from "../mongoose/posts"
import type { Post, Item, FeedItem } from "../types/feed"

type FeedScope = "mixed" | "posts" | "items"

interface FetchOptions {
  page?: number
  limit?: number
  userId?: string
  scope?: FeedScope // supports the 3 feeds: "mixed" (default), "posts", "items"
}

// Merged (SQL+Mongo via fetchPosts) → FeedItem (Post)
function mapMergedPostToFeedItem(p: any): FeedItem {
  const user = {
    id: String(p.user?.id ?? p.userId ?? p.creatorId ?? "unknown"),
    name: p.user?.display_name ?? "Unknown User",
    handle: p.user?.username ?? "unknown",
    avatar: p.user?.avatar_url ?? "/default-avatar.png",
    verified: Boolean(p.user?.verified),
  }

  return {
    // prefer Mongo object id for merged posts when available, otherwise fall back to SQL id
    id: p.mongoId ? `post:${String(p.mongoId)}` : p._id ? `post:${String(p._id)}` : `post:${String(p.id)}`,
    type: "post" as const,
    created_at: safeDate(p.createdAt ?? p.created_at),
    timestamp: formatTimestamp(safeDate(p.createdAt ?? p.created_at)),
    user,
    content: {
      text: p.content ?? "",
      media: Array.isArray(p.media)
        ? p.media.map((m: any) => ({
            type: (m?.type as "image" | "video" | "audio") || "image",
            url: m?.url || "/placeholder.svg",
            alt: m?.alt || "Post media",
          }))
        : [],
    },
    engagement: {
      likes: Number(p.analytics?.likes_count ?? (p.likes?.length ?? 0)),
      comments: Number(p.analytics?.comments_count ?? (p.comments?.length ?? 0)),
      shares: Number(p.analytics?.shares_count ?? 0),
      bookmarks: 0,
    },
    isLiked: false,
    isBookmarked: false,
  }
}

/** ---------- Utilities ---------- */

function safeDate(d?: Date | string | null): Date {
  if (!d) return new Date(0)
  try {
    if (d instanceof Date) return d
    const date = new Date(d)
    return isNaN(date.getTime()) ? new Date(0) : date
  } catch {
    return new Date(0)
  }
}

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString()
}

function pickUserFromPrisma(u?: {
  id: string
  is_verified: boolean | null
  user_profile?: {
    username: string | null
    display_name: string | null
    avatar_url: string | null
  } | null
}) {
  return {
    id: u?.id ?? "unknown",
    name: u?.user_profile?.display_name ?? "Unknown User",
    handle: u?.user_profile?.username ?? "unknown",
    avatar: u?.user_profile?.avatar_url ?? "/default-avatar.png",
    verified: Boolean(u?.is_verified),
  }
}

function avg(nums: number[]): number {
  if (!nums.length) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

/** ---------- Mappers to FeedItem ---------- */

// Mongo → FeedItem (Post)
function mapMongoPostToFeedItem(
  post: Post,
  userById: Record<
    string,
    {
      id: string
      is_verified: boolean | null
      user_profile?: {
        username: string | null
        display_name: string | null
        avatar_url: string | null
      } | null
    }
  >
): FeedItem {
  const creator = (post as any).creatorId ?? (post as any).userId
  const u = userById[String(creator)]
  const user = pickUserFromPrisma(u)
  return {
    // use Mongo ObjectId for mongo posts (stable, unique)
    id: `post:${String(post._id)}`,
    type: "post" as const,
    created_at: safeDate(post.createdAt),
    timestamp: formatTimestamp(safeDate(post.createdAt)),
    user,
    content: {
      text: (post as any).content ?? "",
      // Prefer array-shaped media from Mongo; fallback to legacy single mediaUrl/mediaType
      media: Array.isArray((post as any).media)
        ? ((post as any).media || []).map((m: any) => ({
            type: (m?.type as "image" | "video" | "audio") || "image",
            url: m?.url || "/placeholder.svg",
            alt: m?.alt || "Post media",
          }))
        : (post as any).mediaUrl
        ? [
            {
              type: (((post as any).mediaType as "image" | "video" | "audio") || "image"),
              url: (post as any).mediaUrl,
              alt: "Post media",
            },
          ]
        : [],
    },
    engagement: {
      likes: Number((post as any).likes ?? 0),
      comments: Number((post as any).comments ?? 0),
      shares: Number((post as any).shares ?? 0),
      bookmarks: Number((post as any).bookmarks ?? 0),
    },
    isLiked: false,
    isBookmarked: false,
  }
}

// Prisma Social → FeedItem (Post)
function mapPrismaSocialPostToFeedItem(p: any): FeedItem {
  const user = pickUserFromPrisma(p.users)
  
  // Use _count for analytics since posts_analytics might not exist
  const analyticsLikes = p._count?.likes ? Number(p._count.likes) : 0
  const analyticsComments = p._count?.comments ? Number(p._count.comments) : 0

  return {
    // SQL-post id; prefix to avoid collision with mongo ids
    id: `post:${String(p.id)}`,
    type: "post" as const,
    created_at: safeDate(p.created_at),
    timestamp: formatTimestamp(safeDate(p.created_at)),
    user,
    content: {
      text: p.description ?? "",
      media: [], // Prisma schema doesn't have media fields for posts_metadata
    },
    engagement: {
      likes: analyticsLikes,
      comments: analyticsComments,
      shares: 0, // Not available in schema
      bookmarks: 0, // Not available in schema
    },
    isLiked: false,
    isBookmarked: false,
  }
}

// Prisma Items → FeedItem (Item) - FIXED
function mapPrismaItemToFeedItem(i: any): FeedItem {
  const user = pickUserFromPrisma(i.users)
  
  // Calculate average rating safely
  const ratings = (i.reviews ?? [])
    .map((r: { rating: number | null }) => (r.rating ? Number(r.rating) : 0))
    .filter((n: number) => n > 0)

  return {
    // prefix item ids to avoid collision with post ids
    id: `item:${String(i.item_id)}`,
    type: "marketplace" as const,
    created_at: safeDate(i.created_at),
    timestamp: formatTimestamp(safeDate(i.created_at)),
    user,
    content: {
      text: i.description ?? "",
      media: [], // Prisma schema doesn't have media fields for items
      product: {
        title: i.title ?? "Untitled",
        price: String(i.price ? Number(i.price) : 0),
        category: i.category ?? "General",
        rating: 0, // Not available without reviews
      },
    },
    engagement: {
      likes: 0, // Not available in schema
      comments: 0, // Not available without _count
      shares: 0, // Not available in schema
      bookmarks: 0, // Not available without _count
    },
    isLiked: false,
    isBookmarked: false,
  }
}

// Mongo → FeedItem (Item)
function mapMongoItemToFeedItem(
  item: Item,
  userById: Record<
    string,
    {
      id: string
      is_verified: boolean | null
      user_profile?: {
        username: string | null
        display_name: string | null
        avatar_url: string | null
      } | null
    }
  >
): FeedItem {
  const creator = (item as any).creatorId ?? (item as any).userId
  const u = userById[String(creator)]
  const user = pickUserFromPrisma(u)

  return {
    // use Mongo ObjectId for items and prefix
    id: `item:${String(item._id)}`,
    type: "marketplace" as const,
    created_at: safeDate(item.createdAt),
    timestamp: formatTimestamp(safeDate(item.createdAt)),
    user,
    content: {
      text: item.description ?? "",
      media: item.fileUrl && ["image", "video", "audio"].includes(item.fileType)
        ? [
            {
              type: (item.fileType as "image" | "video" | "audio"),
              url: item.fileUrl,
              alt: item.title ?? "Media",
            },
          ]
        : [],
      product: {
        title: item.title ?? "Untitled",
        price: String(item.price ?? 0),
        originalPrice: item.originalPrice ? String(item.originalPrice) : undefined,
        category: item.category ?? "General",
        rating: Number(item.rating ?? 0),
        students: Number(item.students ?? 0),
        tracks: Number(item.tracks?.length ?? 0),
        duration: undefined,
        courses: Number(item.courses?.length ?? 0),
        hours: item.hours ? String(item.hours) : undefined,
        discount: item.discount ? String(item.discount) : undefined,
      },
    },
    engagement: {
      likes: Array.isArray((item as any).likes)
        ? (item as any).likes.length
        : Number((item as any).likes ?? 0),
      comments: Array.isArray((item as any).comments)
        ? (item as any).comments.length
        : Number((item as any).comments ?? 0),
      shares: Array.isArray((item as any).shares)
        ? (item as any).shares.length
        : Number((item as any).shares ?? 0),
      bookmarks: Array.isArray((item as any).bookmarks)
        ? (item as any).bookmarks.length
        : Number((item as any).bookmarks ?? 0),
    },
    isLiked: false,
    isBookmarked: false,
  }
}


/** ---------- Main fetcher ---------- */

export async function fetchUnifiedFeed({
  page = 1,
  limit = 10,
  userId,
  scope = "mixed",
}: FetchOptions): Promise<{
  feed: FeedItem[]
  pagination: { total: number; page: number; limit: number; hasMore: boolean }
}> {
  try {
    // 1) Connect to Mongo once (idempotent)
    await connectToDatabase()

    const skip = (page - 1) * limit
    const take = limit

    // 2) Fetch raw data per scope
    const wantPosts = scope === "mixed" || scope === "posts"
    const wantItems = scope === "mixed" || scope === "items"

    // Calculate how many items to take from each source for mixed feed
    const getSourceLimit = (sourceCount: number) => {
      if (scope !== "mixed") return take
      // For mixed feed, divide limit among available sources
      return Math.ceil(take / sourceCount)
    }

    const sourceCount = [wantPosts, wantItems].filter(Boolean).length
    const sourceLimit = getSourceLimit(sourceCount)

    // Split limits further within posts and items between their two subsources
    const splitHalf = (n: number) => Math.max(1, Math.ceil(n / 2))
    const postsGroupLimit = wantPosts ? (scope === "mixed" ? sourceLimit : take) : 0
    const itemsGroupLimit = wantItems ? (scope === "mixed" ? sourceLimit : take) : 0
    const postsEachLimit = wantPosts ? splitHalf(postsGroupLimit) : 0
    const itemsEachLimit = wantItems ? splitHalf(itemsGroupLimit) : 0

    // Posts via helper (merged SQL+Mongo) - THIS ALREADY MERGES EVERYTHING!
    const mergedPostsPromise = wantPosts
      ? fetchPosts({ page, limit: take }).then((res) =>
          // filter visible if present
          (res.posts as any[]).filter((p) => (p as any).visibility !== false)
        )
      : Promise.resolve<any[]>([])

    // Items from Mongo via helper
    const mongoItemPromise = wantItems
      ? fetchItems({ page, limit: itemsEachLimit }).then((res) =>
          // filter visible if present
          (res.items as any[]).filter((i) => (i as any).visibility !== false)
        )
      : Promise.resolve<any[]>([])

    // NOTE: We DO NOT fetch pgSocialPosts separately anymore!
    // fetchPosts already merges SQL metadata with Mongo content.
    // Fetching pgSocialPosts separately was causing duplicates.

    // Prisma Items (guarded)
    const pgItemsPromise = wantItems
      ? prismaItems.items.findMany({
          where: { availability: true },
          orderBy: { created_at: "desc" },
          skip,
          take: itemsEachLimit,
          include: {
            users: {
              select: {
                id: true,
                is_verified: true,
                user_profile: {
                  select: { username: true, display_name: true, avatar_url: true },
                },
              },
            },
          },
        })
      : Promise.resolve<any[]>([])

    const [mergedPosts, mongoItems, pgItems] = await Promise.all([
      mergedPostsPromise,
      mongoItemPromise,
      pgItemsPromise,
    ])

    // 3) Batch-load user profiles for Mongo docs from the User DB (Prisma)
    const mongoUserIds = new Set<string>()
    if (wantItems)
      mongoItems.forEach((i) => {
        const iid = (i as any)?.creatorId ?? (i as any)?.userId
        if (iid) mongoUserIds.add(String(iid))
      })

    let prismaUsersById: Record<
      string,
      {
        id: string
        is_verified: boolean | null
        user_profile?: {
          username: string | null
          display_name: string | null
          avatar_url: string | null
        } | null
      }
    > = {}

    if (mongoUserIds.size) {
      const prismaUsers = await prismaUser.users.findMany({
        where: { id: { in: Array.from(mongoUserIds) } },
        select: {
          id: true,
          is_verified: true,
          user_profile: {
            select: { username: true, display_name: true, avatar_url: true },
          },
        },
      })
      prismaUsersById = Object.fromEntries(prismaUsers.map((u) => [u.id, u]))
    }

    // 4) Map to unified FeedItem[]
    const mapped: FeedItem[] = []

    if (wantPosts) {
      // Use merged posts (SQL metadata + Mongo content already combined)
      for (const p of mergedPosts) {
        mapped.push(mapMergedPostToFeedItem(p))
      }
    }

    if (wantItems) {
      // Mongo items
      for (const i of mongoItems) {
        mapped.push(mapMongoItemToFeedItem(i, prismaUsersById))
      }
      // Prisma items
      const mongoItemIds = new Set<string>(mongoItems.map((m: any) => String(m?._id)))
      for (const pi of pgItems) {
        if (!mongoItemIds.has(String(pi.item_id))) {
          mapped.push(mapPrismaItemToFeedItem(pi))
        }
      }
    }

    // 5) Sort by created_at DESC and take exactly `limit` items
    const sorted = mapped.sort(
      (a, b) => safeDate(b.created_at).getTime() - safeDate(a.created_at).getTime()
    )
    const pageSlice = sorted.slice(0, limit)

    // 6) Get accurate counts for pagination
    // Totals: use merged posts total to avoid double counting,
    // items = mongo items total + prisma items count
    const [postsTotal, mongoItemsTotal, prismaItemsTotal] = await Promise.all([
      wantPosts ? fetchPosts({ page: 1, limit: 1 }).then((r) => r.pagination.total) : Promise.resolve(0),
      wantItems ? fetchItems({ page: 1, limit: 1 }).then((r) => r.pagination.total) : Promise.resolve(0),
      wantItems ? prismaItems.items.count({ where: { availability: true } }) : Promise.resolve(0),
    ])

    const total = (wantPosts ? postsTotal : 0) + (wantItems ? mongoItemsTotal + prismaItemsTotal : 0)
    
    // Calculate hasMore based on whether we got fewer items than requested
    // OR if there are more items beyond what we've fetched
    const hasMore = pageSlice.length === limit || total > page * limit

    return {
      feed: pageSlice,
      pagination: {
        total,
        page,
        limit,
        hasMore,
      },
    }
  } catch (error) {
    console.error("[fetchUnifiedFeed] error:", error)
    // Re-throw the error so calling components can handle it properly
    throw error
  }
}

/* --------------------------------------------------------------
   OPTIONAL helpers if you want dedicated feeds elsewhere:
   (Your current UI calls fetchUnifiedFeed for the mixed feed.)
----------------------------------------------------------------- */

export async function fetchPostsFeed(opts: Omit<FetchOptions, "scope">) {
  try {
    return await fetchUnifiedFeed({ ...opts, scope: "posts" })
  } catch (error) {
    console.error("[fetchPostsFeed] error:", error)
    throw error
  }
}

export async function fetchItemsFeed(opts: Omit<FetchOptions, "scope">) {
  try {
    return await fetchUnifiedFeed({ ...opts, scope: "items" })
  } catch (error) {
    console.error("[fetchItemsFeed] error:", error)
    throw error
  }
}
