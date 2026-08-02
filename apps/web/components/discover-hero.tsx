"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DiscoverHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-8 mb-8">
      <div className="relative z-10">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary animate-pulse-soft" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Discover Dreams
            </h1>
            <Sparkles className="h-8 w-8 text-secondary animate-pulse-soft" />
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore millions of creative works from dreamers around the world. Find your next inspiration.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for dreams, creators, or collections..."
                className="pl-12 pr-32 py-3 text-lg rounded-full border-none bg-background/80 backdrop-blur dark:bg-background/80 dark:text-foreground light:bg-white/90 light:text-slate-900 light:placeholder:text-slate-500"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 dream-button text-primary-foreground rounded-full">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Card className="bg-background/50 backdrop-blur border-none">
              <CardContent className="p-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">2.4M+</p>
                  <p className="text-xs text-muted-foreground">Dreams</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur border-none">
              <CardContent className="p-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="font-semibold">180K+</p>
                  <p className="text-xs text-muted-foreground">Creators</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur border-none">
              <CardContent className="p-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <div className="text-left">
                  <p className="font-semibold">50K+</p>
                  <p className="text-xs text-muted-foreground">Daily Uploads</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse-soft"></div>
    </div>
  )
}
