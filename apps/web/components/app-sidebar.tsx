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
      <SidebarHeader className="p-6 overflow-hidden flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-xl p-2 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: "rgba(0, 255, 0, 0.2)", boxShadow: "0 0 15px rgba(0, 255, 0, 0.4)" }}>
            <Sparkles className="h-5 w-5" style={{ color: "#00ff00" }} />
          </div>
          <span className="font-serif italic text-xl tracking-tighter group-hover:text-white transition-colors" style={{ color: "#00ff00" }}>
            DreamDOT
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-hidden px-3 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-4" style={{ color: "rgba(0, 255, 0, 0.4)" }}>The Stream</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isHome)} className="h-12 rounded-2xl transition-all duration-500 active:scale-95 group relative overflow-hidden hover:bg-white/5">
                  <Link href="/feed">
                    <Home className={cn("transition-colors", isHome ? "text-green-400" : "text-foreground/40" )} style={{ color: isHome ? "#00ff00" : undefined }} />
                    <span className={cn("font-medium transition-colors", isHome ? "text-white" : "text-foreground/60")} style={{ color: isHome ? "#00ff00" : undefined }}>Home</span>
                    {isHome && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full" style={{ backgroundColor: "#00ff00" }} />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isDiscover)} className="h-12 rounded-2xl transition-all duration-500 group relative overflow-hidden hover:bg-white/5">
                  <Link href="/discover">
                    <Compass className={cn("transition-colors", isDiscover ? "text-green-400" : "text-foreground/40")} style={{ color: isDiscover ? "#00ff00" : undefined }} />
                    <span className={cn("font-medium transition-colors", isDiscover ? "text-white" : "text-foreground/60")} style={{ color: isDiscover ? "#00ff00" : undefined }}>Discover</span>
                    {isDiscover && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full" style={{ backgroundColor: "#00ff00" }} />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isMarketplace)} className="h-12 rounded-2xl transition-all duration-500 group relative overflow-hidden hover:bg-white/5">
                  <Link href="/marketplace">
                    <ShoppingBag className={cn("transition-colors", isMarketplace ? "text-green-400" : "text-foreground/40")} style={{ color: isMarketplace ? "#00ff00" : undefined }} />
                    <span className={cn("font-medium transition-colors", isMarketplace ? "text-white" : "text-foreground/60")} style={{ color: isMarketplace ? "#00ff00" : undefined }}>Market</span>
                    {isMarketplace && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full" style={{ backgroundColor: "#00ff00" }} />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-4" style={{ color: "rgba(0, 255, 0, 0.4)" }}>Atelier</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isAnalytics)} className="h-12 rounded-2xl transition-all duration-500 group relative overflow-hidden hover:bg-white/5">
                  <Link href="/analytics">
                    <BarChart3 className={cn("transition-colors", isAnalytics ? "text-green-400" : "text-foreground/40")} style={{ color: isAnalytics ? "#00ff00" : undefined }} />
                    <span className={cn("font-medium transition-colors", isAnalytics ? "text-white" : "text-foreground/60")} style={{ color: isAnalytics ? "#00ff00" : undefined }}>Insights</span>
                    {isAnalytics && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full" style={{ backgroundColor: "#00ff00" }} />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={Boolean(isCreate)} className="h-12 rounded-2xl transition-all duration-500 group relative overflow-hidden hover:bg-white/5">
                  <Link href="/create">
                    <PlusSquare className={cn("transition-colors", isCreate ? "text-green-400" : "text-foreground/40")} style={{ color: isCreate ? "#00ff00" : undefined }} />
                    <span className={cn("font-medium transition-colors", isCreate ? "text-white" : "text-foreground/60")} style={{ color: isCreate ? "#00ff00" : undefined }}>Craft Item</span>
                    {isCreate && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full" style={{ backgroundColor: "#00ff00" }} />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-2xl transition-all duration-500 active:scale-95 group relative overflow-hidden hover:bg-white/5">
                  <Link href="/payment">
                    <Wallet className="text-foreground/40 group-hover:text-white transition-colors" style={{ color: "#00ff00" }} />
                    <span className="font-medium text-foreground/60 group-hover:text-white" style={{ color: "#00ff00" }}>Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 mb-4" style={{ color: "rgba(0, 255, 0, 0.4)" }}>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 rounded-2xl transition-all duration-500 active:scale-95 group relative overflow-hidden hover:bg-white/5">
                  <Link href="/settings">
                    <Settings className="text-foreground/40 group-hover:text-white transition-colors" style={{ color: "#00ff00" }} />
                    <span className="font-medium text-foreground/60 group-hover:text-white" style={{ color: "#00ff00" }}>Preferences</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 overflow-hidden flex-shrink-0">
        <Button 
          className="w-full h-12 rounded-2xl shadow-lg border border-white/5 transition-all duration-500 active:scale-[0.98] font-mono text-[10px] uppercase tracking-widest font-semibold"
          style={{ backgroundColor: "#00ff00", color: "#0a0f1f" }}
          onClick={() => router.push("/create")}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create New Art
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}