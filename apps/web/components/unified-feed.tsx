"use client";

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchUnifiedFeed } from "@/lib/feed-logic/feed"
import { FeedPost } from "./feed-post"
import { DatabaseErrorFallback } from "./database-error-fallback"

interface FeedData {
  feed: any[]
  pagination: { total: number; page: number; limit: number; hasMore: boolean }
}

export function UnifiedFeed() {
  const [feedData, setFeedData] = useState<FeedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadFeed = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchUnifiedFeed({ page: 1, limit: 10 })
      setFeedData(data)
    } catch (err) {
      console.error("[UnifiedFeed] Error loading feed:", err)
      setError(err instanceof Error ? err : new Error("Unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFeed()
  }, [])

  if (error) {
    return (
      <DatabaseErrorFallback
        error={error}
        component="UnifiedFeed"
        onRetry={loadFeed}
        showDebugInfo={process.env.NODE_ENV === "development"}
      />
    )
  }

  if (isLoading || !feedData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest Dreams</h2>
          <Button variant="outline" size="sm" className="gap-2 rounded-full" disabled>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
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

  return (
    <div className="space-y-10 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif tracking-tight text-foreground/90">
          Latest <span className="text-primary/80">Manifestations</span>
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-500"
          onClick={loadFeed}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Sync Feed'}
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {feedData.feed.length > 0 ? (
            feedData.feed.map((item, idx) => (
              <motion.div
                key={item.id ?? `fallback-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <FeedPost post={item} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10">
              <div className="space-y-4">
                <p className="text-xl font-serif text-foreground/60 italic">No dreams found in this sector</p>
                <p className="text-sm text-muted-foreground/40 max-w-md mx-auto">
                  The atelier is quiet. Be the first to manifest a new artifact and inspire the collective.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {feedData.pagination.hasMore && (
        <div className="text-center py-12">
          <Button 
            variant="outline" 
            className="rounded-full px-8 py-6 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 text-lg font-serif"
          >
            Explore Deeper
          </Button>
        </div>
      )}
    </div>
  )
}
