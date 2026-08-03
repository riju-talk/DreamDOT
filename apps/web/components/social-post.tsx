"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface SocialPostProps {
  post: {
    id: string
    user: {
      name: string
      handle: string
      avatar: string
      verified: boolean
    }
    timestamp: string
    content: {
      text: string
      media?: Array<{
        type: "image" | "video" | "audio"
        url: string
        alt?: string
      }>
    }
    engagement: {
      likes: number
      comments: number
      shares: number
      bookmarks: number
    }
    isLiked: boolean
    isBookmarked: boolean
  }
}

import { motion } from "framer-motion"

export function SocialPost({ post }: SocialPostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
  const [likes, setLikes] = useState(post.engagement.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="dream-card bg-card border-border/50 overflow-hidden group hover:bg-card/80 transition-all duration-700">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border border-border/50 group-hover:scale-105 transition-transform duration-500">
                  <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                  <AvatarFallback className="bg-primary/20 text-primary font-serif">
                    {post.user.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/account/${post.user.handle}`} className="text-base font-serif text-foreground hover:text-primary transition-colors block">
                    {post.user.name}
                  </Link>
                  {post.user.verified && <Sparkles className="h-3 w-3 text-primary" />}
                </div>
                <div className="flex items-center text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                  <span>{post.user.handle}</span>
                  <span className="mx-2 opacity-30">•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border/50 backdrop-blur-sm">
                <DropdownMenuItem className="text-[10px] uppercase font-bold tracking-widest py-3">Save post</DropdownMenuItem>
                <DropdownMenuItem className="text-[10px] uppercase font-bold tracking-widest py-3">Copy link</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem className="text-[10px] uppercase font-bold tracking-widest py-3 text-destructive">Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-xl font-serif text-foreground leading-relaxed italic">
              {post.content.text}
            </p>

            {/* Media */}
            {post.content.media && post.content.media.length > 0 && (
              <div className="space-y-4">
                {post.content.media.map((media, index) => (
                  <div key={index} className="relative overflow-hidden rounded-[32px] border border-border/50 bg-muted/30">
                    {media.type === "image" && (
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src={media.url || "/placeholder.svg"}
                          alt={media.alt || "Post media"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0 flex items-center justify-between border-t border-border/30 mt-4 pt-6 bg-muted/10">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`h-11 px-6 rounded-2xl transition-all duration-500 gap-3 border border-transparent ${
                isLiked 
                  ? "bg-primary/10 border-primary/20 text-primary" 
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/10"
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-[11px] font-bold font-mono tracking-widest">{likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-11 px-6 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-500 gap-3"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-[11px] font-bold font-mono tracking-widest">{post.engagement.comments}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-11 px-6 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-500"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-500 ${
              isBookmarked 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
            onClick={handleBookmark}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
