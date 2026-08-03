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
      className="h-screen flex flex-col overflow-hidden border-r border-border/50 bg-background" 
      variant="inset" 
      collapsible="icon"
    >
      <SidebarHeader className="p-0 overflow-hidden flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group px-4 py-4">
          <div className="relative overflow-hidden rounded-xl p-2 bg-primary shadow-glow transition-transform duration-500 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif italic text-xl text-foreground tracking-tighter group-hover:text-primary transition-colors">
            DreamDOT
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-hidden px-3 space-y-4">
        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-3 text-primary/40">The Stream</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isHome)} 
                  className={cn(
                    "h-10 rounded-xl transition-all duration-300 active:scale-95",
                    isHome 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md text-primary" 
                      : "hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                  )}
                >
                  <Link href="/feed">
                    <Home className="transition-colors" />
                    <span className="font-medium transition-colors">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isDiscover)} 
                  className={cn(
                    "h-10 rounded-xl transition-all duration-300 active:scale-95",
                    isDiscover 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md text-primary" 
                      : "hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                  )}
                >
                  <Link href="/discover">
                    <Compass className="transition-colors" />
                    <span className="font-medium transition-colors">Discover</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isMarketplace)} 
                  className={cn(
                    "h-10 rounded-xl transition-all duration-300 active:scale-95",
                    isMarketplace 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md text-primary" 
                      : "hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                  )}
                >
                  <Link href="/marketplace">
                    <ShoppingBag className="transition-colors" />
                    <span className="font-medium transition-colors">Market</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-3 text-primary/40">Atelier</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isAnalytics)} 
                  className={cn(
                    "h-10 rounded-xl transition-all duration-300 active:scale-95",
                    isAnalytics 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md text-primary" 
                      : "hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                  )}
                >
                  <Link href="/analytics">
                    <BarChart3 className="transition-colors" />
                    <span className="font-medium transition-colors">Insights</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isCreate)} 
                  className={cn(
                    "h-10 rounded-xl transition-all duration-300 active:scale-95",
                    isCreate 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md text-primary" 
                      : "hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                  )}
                >
                  <Link href="/create">
                    <PlusSquare className="transition-colors" />
                    <span className="font-medium transition-colors">Craft Item</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={Boolean(isMessages)} 
                  className={cn(
                    "h-10 rounded-xl transition-all duration-300 active:scale-95",
                    isMessages 
                      ? "bg-primary/10 border-l-2 border-primary shadow-md text-primary" 
                      : "hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                  )}
                >
                  <Link href="/messages">
                    <MessageSquare className="transition-colors" />
                    <span className="font-medium transition-colors">Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="h-10 rounded-xl transition-all duration-300 active:scale-95 hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                >
                  <Link href="/payment">
                    <Wallet className="transition-colors" />
                    <span className="font-medium transition-colors">Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-3 text-primary/40">Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="h-10 rounded-xl transition-all duration-300 active:scale-95 hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                >
                  <Link href="/profile/gallery">
                    <Compass className="transition-colors" />
                    <span className="font-medium transition-colors">Gallery</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="h-10 rounded-xl transition-all duration-300 active:scale-95 hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                >
                  <Link href="/vault">
                    <ShoppingBag className="transition-colors" />
                    <span className="font-medium transition-colors">Vault</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="h-10 rounded-xl transition-all duration-300 active:scale-95 hover:bg-foreground/5 text-foreground/60 hover:text-primary"
                >
                  <Link href="/profile/settings">
                    <Settings className="transition-colors" />
                    <span className="font-medium transition-colors">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 overflow-hidden flex-shrink-0">
        <Button 
          className="w-full h-10 rounded-xl shadow-glow border border-white/5 transition-all duration-300 active:scale-[0.98] font-mono text-[9px] uppercase tracking-widest font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push("/create")}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create Something New
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
