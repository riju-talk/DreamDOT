import { fetchPosts } from "@/lib/mongoose/posts"
import { SocialPost } from "./social-post"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import Link from "next/link"
import { getFakePosts } from "@/lib/fake-data"

interface PostData {
  id: string
  user?: {
    display_name?: string
    username?: string
    avatar_url?: string
    verified?: boolean
  }
  created_at: string
  content?: string
  media?: Array<{
    type?: "image" | "video" | "audio"
    url?: string
    alt?: string
  }>
  analytics?: {
    likes_count?: number
    comments_count?: number
  }
}

interface PostsResponse {
  posts: PostData[]
}

export async function SocialFeed() {
  let postsData: PostsResponse | null = null
  
  try {
    postsData = await fetchPosts({ page: 1, limit: 5 })
  } catch (error) {
    console.error("Error loading posts from database, using fake data:", error)
    postsData = null
  }

  // Use fake data if database fetch fails
  const posts = postsData?.posts || convertFakePostsToPostData(getFakePosts().slice(0, 5))
    
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest Posts</h2>
          <div className="flex items-center gap-2">
            <form action="/discover" method="get">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <SocialPost
                key={post.id}
                post={{
                  id: post.id,
                  user: {
                    name: post.user?.display_name || post.user?.username || "Anonymous",
                    handle: post.user?.username || "user",
                    avatar: post.user?.avatar_url || "/placeholder.svg",
                    verified: post.user?.verified || false,
                  },
                  timestamp: new Date(post.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  content: {
                    text: post.content || "",
                    media: Array.isArray(post.media) ? post.media.map((m) => ({
                      type: m.type || "image",
                      url: m.url || "/placeholder.svg",
                      alt: m.alt || "Post media"
                    })) : []
                  },
                  engagement: {
                    likes: post.analytics?.likes_count || 0,
                    comments: post.analytics?.comments_count || 0,
                    shares: 0,
                    bookmarks: 0
                  },
                  isLiked: false,
                  isBookmarked: false
                }}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="space-y-2">
                <p className="text-muted-foreground">No posts found</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your thoughts with the community!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center py-8">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/discover?page=2">Load More Posts</Link>
          </Button>
        </div>
      </div>
    )
}

// Helper function to convert fake posts to PostData format
function convertFakePostsToPostData(fakePosts: any[]): PostData[] {
  return fakePosts.map((post) => ({
    id: post.id,
    user: {
      display_name: post.author?.name || "Anonymous",
      username: post.author?.name?.toLowerCase().replace(/\s+/g, "_") || "user",
      avatar_url: post.author?.avatar || "/placeholder.svg",
      verified: false,
    },
    created_at: post.createdAt.toISOString(),
    content: post.content || "",
    media: post.image ? [{ type: "image", url: post.image, alt: post.title }] : [],
    analytics: {
      likes_count: post.likes || 0,
      comments_count: post.comments || 0,
    }
  }))
}
