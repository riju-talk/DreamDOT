import { Suspense } from "react"
import { SocialFeed } from "./social-feed"

function SocialFeedSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Latest Posts</h2>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-muted rounded"></div>
                  <div className="w-24 h-3 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-muted rounded"></div>
                <div className="w-3/4 h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Server component wrapper - no "use client" directive
export function SocialFeedWrapper() {
  return (
    <Suspense fallback={<SocialFeedSkeleton />}>
      <SocialFeed />
    </Suspense>
  )
}
