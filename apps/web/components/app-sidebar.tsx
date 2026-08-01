"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Compass,
  ShoppingBag,
  BarChart3,
  MessageSquare,
  PlusSquare,
  Wallet,
  Settings,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  
  const isHome = pathname === "/feed" || pathname === "/"
  const isDiscover = pathname?.startsWith("/discover")
  const isMarketplace = pathname?.startsWith("/marketplace")
  const isAnalytics = pathname?.startsWith("/analytics")
  const isCreate = pathname?.startsWith("/create")
  const isMessages = pathname?.startsWith("/messages")

  return (
    <Sidebar 
      className="h-screen flex flex-col overflow-hidden border-r-0 bg-background" 
      variant="inset" 
      collapsible="icon"
    >
      <SidebarHeader className="p-6 overflow-hidden flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-xl p-2 bg-primary shadow-glow transition-transform duration-500 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif italic text-xl text-foreground tracking-tighter group-hover:text-primary transition-colors">
            DreamDOT
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-hidden px-3 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-4 text-primary/40">The Stream</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isHome)} 
                  className={cn(
                    "h-12 rounded-2xl transition-all duration-300 active:scale-95 group relative overflow-hidden",
                    isHome 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md" 
                      : "hover:bg-foreground/5"
                  )}
                >
                  <Link href="/feed">
                    <Home className={cn("transition-colors", isHome ? "text-primary" : "text-foreground/40 group-hover:text-primary")} />
                    <span className={cn("font-medium transition-colors", isHome ? "text-primary" : "text-foreground/60 group-hover:text-primary")}>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isDiscover)} 
                  className={cn(
                    "h-12 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isDiscover 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md" 
                      : "hover:bg-foreground/5"
                  )}
                >
                  <Link href="/discover">
                    <Compass className={cn("transition-colors", isDiscover ? "text-primary" : "text-foreground/40 group-hover:text-primary")} />
                    <span className={cn("font-medium transition-colors", isDiscover ? "text-primary" : "text-foreground/60 group-hover:text-primary")}>Discover</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isMarketplace)} 
                  className={cn(
                    "h-12 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isMarketplace 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md" 
                      : "hover:bg-foreground/5"
                  )}
                >
                  <Link href="/marketplace">
                    <ShoppingBag className={cn("transition-colors", isMarketplace ? "text-primary" : "text-foreground/40 group-hover:text-primary")} />
                    <span className={cn("font-medium transition-colors", isMarketplace ? "text-primary" : "text-foreground/60 group-hover:text-primary")}>Market</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-4 text-primary/40">Atelier</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isAnalytics)} 
                  className={cn(
                    "h-12 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isAnalytics 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md" 
                      : "hover:bg-foreground/5"
                  )}
                >
                  <Link href="/analytics">
                    <BarChart3 className={cn("transition-colors", isAnalytics ? "text-primary" : "text-foreground/40 group-hover:text-primary")} />
                    <span className={cn("font-medium transition-colors", isAnalytics ? "text-primary" : "text-foreground/60 group-hover:text-primary")}>Insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isCreate)} 
                  className={cn(
                    "h-12 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isCreate 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md" 
                      : "hover:bg-foreground/5"
                  )}
                >
                  <Link href="/create">
                    <PlusSquare className={cn("transition-colors", isCreate ? "text-primary" : "text-foreground/40 group-hover:text-primary")} />
                    <span className={cn("font-medium transition-colors", isCreate ? "text-primary" : "text-foreground/60 group-hover:text-primary")}>Craft Item</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isMessages)} 
                  className={cn(
                    "h-12 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isMessages 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md" 
                      : "hover:bg-foreground/5"
                  )}
                >
                  <Link href="/messages">
                    <MessageSquare className={cn("transition-colors", isMessages ? "text-primary" : "text-foreground/40 group-hover:text-primary")} />
                    <span className={cn("font-medium transition-colors", isMessages ? "text-primary" : "text-foreground/60 group-hover:text-primary")}>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="h-12 rounded-2xl transition-all duration-300 active:scale-95 group relative overflow-hidden hover:bg-foreground/5"
                >
                  <Link href="/payment">
                    <Wallet className="text-foreground/40 group-hover:text-primary transition-colors" />
                    <span className="font-medium text-foreground/60 group-hover:text-primary transition-colors">Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-4 text-primary/40">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="h-12 rounded-2xl transition-all duration-300 active:scale-95 group relative overflow-hidden hover:bg-foreground/5"
                >
                  <Link href="/settings">
                    <Settings className="text-foreground/40 group-hover:text-primary transition-colors" />
                    <span className="font-medium text-foreground/60 group-hover:text-primary transition-colors">Preferences</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 overflow-hidden flex-shrink-0">
        <Button 
          className="w-full h-12 rounded-2xl shadow-glow border border-white/5 transition-all duration-300 active:scale-[0.98] font-mono text-[10px] uppercase tracking-widest font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push("/create")}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create New Art
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
