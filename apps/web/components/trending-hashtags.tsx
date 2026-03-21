import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash, TrendingUp } from "lucide-react"

const trendingHashtags = [
  { name: "digitalart", posts: "45.2K", trending: true },
  { name: "cyberpunk", posts: "32.1K", trending: true },
  { name: "fantasy", posts: "28.9K", trending: false },
  { name: "photography", posts: "24.7K", trending: true },
  { name: "storytelling", posts: "19.3K", trending: false },
  { name: "musicproduction", posts: "17.8K", trending: false },
  { name: "abstract", posts: "15.6K", trending: true },
  { name: "portrait", posts: "14.2K", trending: false },
  { name: "neonvibes", posts: "12.9K", trending: true },
  { name: "WIP", posts: "11.4K", trending: false },
]

export function TrendingHashtags() {
  return (
    <Card className="dream-card bg-white/[0.02] backdrop-blur-3xl border-white/[0.05] overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/[0.05]">
        <CardTitle className="text-xl font-serif flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Hash className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Trending Symbols</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {trendingHashtags.map((tag, index) => (
            <div
              key={tag.name}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all duration-500 group/item border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-white/20 font-bold w-4">0{index + 1}</span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80 group-hover/item:text-primary transition-colors">#{tag.name}</span>
                    {tag.trending && <TrendingUp className="h-3 w-3 text-primary animate-pulse" />}
                  </div>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold font-mono">{tag.posts} manifests</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </Card>
  )
}
