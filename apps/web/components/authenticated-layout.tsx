"use client"

import { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TopNav } from "./top-nav"
import { MobileNav } from "./mobile-nav"
import { ScrollableContent } from "./scrollable-content"

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      {/* Main Layout Container */}
      <div className="flex min-h-screen w-full overflow-x-clip bg-background">
        {/* Sidebar - Desktop only (>768px), fixed left position */}
        {/* The SidebarProvider handles responsive visibility via CSS */}
        <AppSidebar />

        {/* Main Content Area */}
        <SidebarInset className="min-w-0 flex-1 overflow-x-clip relative flex flex-col">
          {/* Top Navigation Bar - Fixed, z-index positioned above content */}
          <div className="relative z-30">
            <TopNav />
          </div>

          {/* Scrollable Content - Responsive padding to prevent content overlap with navs */}
          <ScrollableContent>
            <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
              {children}
            </main>
          </ScrollableContent>

          {/* Mobile Bottom Navigation - Mobile only (<768px), fixed bottom position */}
          {/* z-index: 50 to appear above content and sidebar */}
          <div className="relative z-50">
            <MobileNav />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
