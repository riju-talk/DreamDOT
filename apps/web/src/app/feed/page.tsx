"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthenticatedLayout } from "../../../components/authenticated-layout"
import { Heart, MessageCircle, Share2, Bookmark, ArrowRight } from "lucide-react"
import { getFakePosts } from "@/lib/fake-data"
import Image from "next/image"
import { useState } from "react"

export default function FeedPage() {
  const posts = getFakePosts()
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-[#f5f7f0] dark:bg-[#0a0f1f]">
        {/* Feed Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {posts.map((post, idx) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card className="border-border/50 hover:border-border transition-all overflow-hidden group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{post.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.floor((Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60))} hours ago
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="hover:bg-foreground/10">
                        Follow
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                    </div>

                    {post.image && (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-foreground/5">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 cursor-pointer hover:bg-blue-500/20 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground border-t border-border/30">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 hover:bg-red-500/10 group/btn"
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 transition-colors ${
                            likedPosts.has(post.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground group-hover/btn:text-red-500"
                          }`}
                        />
                        <span className="text-muted-foreground group-hover/btn:text-red-500 transition-colors">
                          Like
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 hover:bg-blue-500/10">
                        <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-blue-500" />
                        <span className="text-muted-foreground group-hover:text-blue-500 transition-colors">
                          Comment
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 hover:bg-purple-500/10">
                        <Share2 className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-purple-500" />
                        <span className="text-muted-foreground group-hover:text-purple-500 transition-colors">
                          Share
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 hover:bg-yellow-500/10">
                        <Bookmark className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-yellow-500" />
                        <span className="text-muted-foreground group-hover:text-yellow-500 transition-colors">
                          Save
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Load More */}
            <motion.div variants={itemVariants} className="text-center pt-8">
              <Button
                variant="outline"
                className="border-border/50 hover:bg-foreground/10"
              >
                Load More Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
