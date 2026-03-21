import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus, Sparkles } from "lucide-react"
import Link from "next/link"

const suggestedCreators = [
  {
    name: "Luna Dreams",
    handle: "@lunadreams",
    avatar: "/placeholder.svg",
    category: "Digital Art",
    followers: "1.2K",
    isVerified: false,
    recentPost: "Amazing space artwork",
  },
  {
    name: "Echo Sounds",
    handle: "@echosounds",
    avatar: "/placeholder.svg",
    category: "Music",
    followers: "856",
    isVerified: false,
    recentPost: "New ambient track",
  },
  {
    name: "Pixel Poet",
    handle: "@pixelpoet",
    avatar: "/placeholder.svg",
    category: "Writing",
    followers: "2.1K",
    isVerified: true,
    recentPost: "Short story collection",
  },
  {
    name: "Frame Walker",
    handle: "@framewalker",
    avatar: "/placeholder.svg",
    category: "Photography",
    followers: "634",
    isVerified: false,
    recentPost: "Street photography tips",
  },
]

export function SuggestedCreators() {
  return (
    <Card className="dream-card bg-white/[0.02] backdrop-blur-3xl border-white/[0.05] overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/[0.05]">
        <CardTitle className="text-xl font-serif flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Suggested Visionaries</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {suggestedCreators.map((creator) => (
          <div key={creator.handle} className="flex items-center justify-between group/item">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border border-white/10 transition-transform duration-500 group-hover/item:scale-110">
                  <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/20 text-primary font-serif">
                    {creator.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/account/${creator.handle}`}
                    className="text-sm font-medium text-white/90 hover:text-primary transition-colors truncate block"
                  >
                    {creator.name}
                  </Link>
                  {creator.isVerified && <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-primary/40 uppercase tracking-widest font-bold font-mono">{creator.category}</p>
                <p className="text-[11px] text-white/20 italic truncate max-w-[120px]">"{creator.recentPost}"</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full px-4 h-8 text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-lg active:scale-95"
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
