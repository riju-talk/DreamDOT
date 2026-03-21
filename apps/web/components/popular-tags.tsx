import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hash, TrendingUp } from "lucide-react"

const popularTags = [
  { name: "digitalart", count: "45.2K", trending: true },
  { name: "lofi", count: "32.1K", trending: true },
  { name: "photography", count: "28.9K", trending: false },
  { name: "cyberpunk", count: "24.7K", trending: true },
  { name: "minimalist", count: "19.3K", trending: false },
  { name: "fantasy", count: "17.8K", trending: false },
  { name: "abstract", count: "15.6K", trending: true },
  { name: "portrait", count: "14.2K", trending: false },
  { name: "ambient", count: "12.9K", trending: false },
  { name: "tutorial", count: "11.4K", trending: false },
  { name: "vintage", count: "10.8K", trending: false },
  { name: "experimental", count: "9.7K", trending: true },
]

export function PopularTags() {
  return (
    <Card className="dream-card bg-white/[0.02] backdrop-blur-3xl border-white/[0.05] overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/[0.05]">
        <CardTitle className="text-xl font-serif flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Hash className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Astral Symbols</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag.name}
              variant="outline"
              className="cursor-pointer bg-white/5 border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 py-2 px-3 rounded-xl flex items-center gap-2 group/tag"
            >
              <span className="text-muted-foreground group-hover/tag:text-primary transition-colors">#</span>
              <span className="text-[12px] font-medium tracking-wide">{tag.name}</span>
              {tag.trending && <TrendingUp className="h-3.5 w-3.5 text-primary animate-pulse" />}
              <span className="text-[10px] text-muted-foreground/40 ml-1 font-mono uppercase font-bold">{tag.count}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </Card>
  )
}
