"use client"

import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TopNav } from "./top-nav"
import { MobileNav } from "./mobile-nav"

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar - Fixed left side - Increased width to 320px */}
        <div className="fixed inset-y-0 left-0 z-40 w-80 border-r border-border/50">
          <AppSidebar />
        </div>

        {/* Right side container - Sidebar width + remaining content */}
        <div className="w-full ml-80 flex flex-col">
          {/* Top Navigation Bar - Full width taking remaining space */}
          <div className="sticky top-0 z-30 border-b border-border/50 bg-background/40 backdrop-blur-3xl flex-shrink-0 w-full">
            <TopNav />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
              {children}
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="z-30 flex-shrink-0 border-t border-border/50 lg:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
