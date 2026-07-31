"use client"

import Link from "next/link"
import { Home, Compass, PlusSquare, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-background/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/80 md:hidden">
      <Link
        href="/feed"
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 transition-colors",
          pathname === "/feed" ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Home className="h-5 w-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link
        href="/discover"
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 transition-colors",
          pathname === "/discover" ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Compass className="h-5 w-5" />
        <span className="text-[10px] font-medium">Discover</span>
      </Link>
      <Link href="/create" className="flex flex-col items-center justify-center -mt-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-90">
          <PlusSquare className="h-5 w-5" />
        </div>
      </Link>
      <Link
        href="/messages"
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 transition-colors relative",
          pathname === "/messages" ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-[10px] font-medium">Messages</span>
        <Badge className="absolute -top-0.5 -right-2 h-4 min-w-4 px-1 text-[9px] bg-primary text-primary-foreground rounded-full">3</Badge>
      </Link>
      <Link
        href="/profile"
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 transition-colors",
          pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <User className="h-5 w-5" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </div>
  )
}
