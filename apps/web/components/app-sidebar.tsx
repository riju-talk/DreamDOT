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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Compass,
  ShoppingBag,
  BarChart3,
  Bell,
  MessageSquare,
  PlusSquare,
  Wallet,
  Settings,
  HelpCircle,
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

  return (
    <Sidebar 
      className="h-screen flex flex-col overflow-hidden border-r-0 bg-background" 
      variant="inset" 
      collapsible="icon"
    >
      <SidebarHeader className="p-8 overflow-hidden flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-xl p-2 bg-primary shadow-glow transition-transform duration-500 group-hover:scale-110">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-serif italic text-2xl text-foreground tracking-tighter group-hover:text-primary transition-colors">
            DreamDOT
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-hidden px-4 space-y-8">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/20 px-4 mb-4">The Stream</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isHome)} className="h-12 rounded-2xl transition-all duration-500 hover:bg-foreground/[0.03] active:scale-95 group relative overflow-hidden">
                  <Link href="/feed">
                    <Home className={cn("transition-colors", isHome ? "text-primary" : "text-foreground/40")} />
                    <span className={cn("font-medium transition-colors", isHome ? "text-foreground" : "text-foreground/60")}>Home</span>
                    {isHome && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-full" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isDiscover)} className="h-12 rounded-2xl transition-all duration-500 hover:bg-foreground/[0.03] group relative overflow-hidden">
                  <Link href="/discover">
                    <Compass className={cn("transition-colors", isDiscover ? "text-primary" : "text-foreground/40")} />
                    <span className={cn("font-medium transition-colors", isDiscover ? "text-foreground" : "text-foreground/60")}>Discover</span>
                    {isDiscover && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-full" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isMarketplace)} className="h-12 rounded-2xl transition-all duration-500 hover:bg-foreground/[0.03] group relative overflow-hidden">
                  <Link href="/marketplace">
                    <ShoppingBag className={cn("transition-colors", isMarketplace ? "text-primary" : "text-foreground/40")} />
                    <span className={cn("font-medium transition-colors", isMarketplace ? "text-foreground" : "text-foreground/60")}>Market</span>
                    {isMarketplace && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-full" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/20 px-4 mb-4">Atelier</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isAnalytics)} className="h-12 rounded-2xl transition-all duration-500 hover:bg-foreground/[0.03] group relative overflow-hidden">
                  <Link href="/analytics">
                    <BarChart3 className={cn("transition-colors", isAnalytics ? "text-primary" : "text-foreground/40")} />
                    <span className={cn("font-medium transition-colors", isAnalytics ? "text-foreground" : "text-foreground/60")}>Insights</span>
                    {isAnalytics && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-full" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isCreate)} className="h-12 rounded-2xl transition-all duration-500 hover:bg-foreground/[0.03] group relative overflow-hidden">
                  <Link href="/create">
                    <PlusSquare className={cn("transition-colors", isCreate ? "text-primary" : "text-foreground/40")} />
                    <span className={cn("font-medium transition-colors", isCreate ? "text-foreground" : "text-foreground/60")}>Craft Item</span>
                    {isCreate && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-primary rounded-full" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-2xl transition-all duration-500 hover:bg-foreground/[0.03] active:scale-95 group relative overflow-hidden">
                  <Link href="/wallet">
                    <Wallet className="text-foreground/40 group-hover:text-primary transition-colors" />
                    <span className="font-medium text-foreground/60 group-hover:text-foreground">Vault</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/20 px-4 mb-4">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-2xl transition-all duration-500 hover:bg-foreground/[0.03] active:scale-95 group relative overflow-hidden">
                  <Link href="/settings">
                    <Settings className="text-foreground/40 group-hover:text-primary transition-colors" />
                    <span className="font-medium text-foreground/60 group-hover:text-foreground">Preferences</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-8 overflow-hidden flex-shrink-0">
        <Button 
          className="w-full h-14 rounded-2xl bg-primary/90 text-primary-foreground hover:bg-primary shadow-glow border border-white/5 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] font-mono text-[10px] uppercase tracking-widest" 
          onClick={() => router.push("/create")}
        >
          <PlusSquare className="mr-3 h-4 w-4" />
          Create New Art
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}