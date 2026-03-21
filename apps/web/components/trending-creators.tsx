"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"

const trendingCreators = [
  {
    name: "ArtisticVision",
    handle: "@artisticvision",
    avatar: "/placeholder.svg",
    followers: "24.5K",
    category: "Digital Art",
  },
  {
    name: "SonicArtist",
    handle: "@sonicartist",
    avatar: "/placeholder.svg",
    followers: "18.2K",
    category: "Music",
  },
  {
    name: "StoryWeaver",
    handle: "@storyweaver",
    avatar: "/placeholder.svg",
    followers: "32.1K",
    category: "Writing",
  },
  {
    name: "StreetLens",
    handle: "@streetlens",
    avatar: "/placeholder.svg",
    followers: "15.7K",
    category: "Photography",
  },
  {
    name: "CodeMaster",
    handle: "@codemaster",
    avatar: "/placeholder.svg",
    followers: "21.3K",
    category: "Courses",
  },
]

export function TrendingCreators() {
  return (
    <Card className="dream-card bg-white/[0.02] backdrop-blur-3xl border-white/[0.05] overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/[0.05]">
        <CardTitle className="text-xl font-serif flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Trending Dreamers</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-6">
        {trendingCreators.map((creator) => (
          <div key={creator.handle} className="flex items-center justify-between group/item">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border border-white/10 ring-offset-background transition-transform duration-500 group-hover/item:scale-110">
                  <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/20 text-primary font-serif">
                    {creator.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-1">
                <Link
                  href={`/account/${creator.handle}`}
                  className="text-sm font-medium leading-none hover:text-primary transition-colors duration-300 block"
                >
                  {creator.name}
                </Link>
                <p className="text-xs text-muted-foreground/60 font-mono italic">{creator.handle}</p>
                <div className="flex items-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/40 font-bold">
                    {creator.followers} • {creator.category}
                  </span>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-4 h-8 text-[11px] uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </Card>
  )
}
