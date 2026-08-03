import { Collection } from "mongoose";
import { connectToDatabase } from "./connection";
import { prismaSocial } from "../prisma/social";
// import { Post } from "./types/Post"; // Using shared model instead
import { Post } from "@repo/database-mongo";

// ------------------------------------
// Data Fetching Logic
// ------------------------------------

interface FetchPostsOptions {
  userId?: string;
  page?: number;
  limit?: number;
}

export async function fetchPosts(options: FetchPostsOptions = {}) {
  try {
    const { userId, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    // Step 1: Fetch PostgreSQL metadata
    const sqlTimerLabel = `⏱ SQL Fetch Time (${Date.now()})`;
    console.time(sqlTimerLabel);
    const sqlPosts = await prismaSocial.posts.findMany({
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      where: userId ? { user_id: userId } : {},
      include: {
        posts_analytics: true,
      },
    });
    console.timeEnd(sqlTimerLabel);

    const totalCount = await prismaSocial.posts.count({
      where: userId ? { user_id: userId } : {},
    });

    if (sqlPosts.length === 0) {
      return {
        posts: [],
        pagination: { total: totalCount, page, limit, hasMore: false },
      };
    }

    // Step 2: Fetch MongoDB posts by SQL IDs
    const mongoConnectLabel = `⏱ Mongo Connection Time (${Date.now()})`;
    console.time(mongoConnectLabel);
    await connectToDatabase();
    console.timeEnd(mongoConnectLabel);

    const postsCollection = Post.collection as Collection<any>;

    // Get all SQL IDs
    const sqlIds = sqlPosts.map((p) => p.id);

    console.log(`🔍 Fetching ${sqlIds.length} MongoDB posts by sqlId`);

    const mongoFetchLabel = `⏱ Mongo Fetch Time (${Date.now()})`;
    console.time(mongoFetchLabel);

    // Direct query by sqlId - this is the magic!
    const mongoPosts = await postsCollection
      .find({ sqlId: { $in: sqlIds } })
      .toArray();

    console.timeEnd(mongoFetchLabel);

    // Map MongoDB posts by sqlId for O(1) lookup
    const mongoPostsMap = new Map<string, any>();
    mongoPosts.forEach(post => {
      if (post.sqlId) {
        mongoPostsMap.set(post.sqlId, post);
      }
    });

    // Fetch user data separately
    const userIds = sqlPosts.map(p => p.user_id).filter(Boolean);
    const users: Record<string, any> = {};
    
    if (userIds.length > 0) {
      const prismaUser = require('../prisma/user').prismaUser;
      const userData = await prismaUser.users.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          is_verified: true,
          user_profile: {
            select: {
              display_name: true,
              username: true,
              avatar_url: true,
            },
          },
        },
      });
      userData.forEach((u: any) => {
        users[u.id] = u;
      });
    }

    // Step 3: Merge - now trivial!
    const posts = sqlPosts.map((sqlPost) => {
      const uid = String(sqlPost.user_id);
      const mongoPost = mongoPostsMap.get(sqlPost.id);
      const user = users[uid];

      if (mongoPost) {
        console.log(`✅ Matched SQL ${sqlPost.id}`);
      } else {
        console.warn(`❌ No MongoDB post for SQL ${sqlPost.id}`);
      }

      return {
        id: sqlPost.id,
        userId: uid,
        content: mongoPost?.content ?? "",
        media: mongoPost?.media ?? [],
        visibility: mongoPost?.visibility ?? true,
        createdAt: mongoPost?.createdAt ?? sqlPost.created_at,
        likes: mongoPost?.likes ?? [],
        comments: mongoPost?.comments ?? [],
        analytics: {
          likes_count: sqlPost.posts_analytics?.likes_count ?? 0,
          comments_count: sqlPost.posts_analytics?.comments_count ?? 0,
          views_count: sqlPost.posts_analytics?.views_count ?? 0,
          shares_count: 0,
        },
        user: {
          id: user?.id || uid,
          username: user?.user_profile?.username || "user",
          display_name: user?.user_profile?.display_name || null,
          avatar_url:
            user?.user_profile?.avatar_url || "/placeholder.svg",
          verified: user?.is_verified || false,
        },
        mongoId: mongoPost?._id?.toString(),
      };
    });

    return {
      posts,
      pagination: {
        total: totalCount,
        page,
        limit,
        hasMore: skip + posts.length < totalCount,
      },
    };
  } catch (error) {
    console.error("🔥 Error fetching posts:", error);
    throw error;
  }
}
