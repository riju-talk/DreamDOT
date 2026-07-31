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
      <div className="flex min-h-screen w-full overflow-x-clip">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1 overflow-x-clip relative">
          <TopNav />
          <ScrollableContent>
            <main className="container mx-auto px-6 md:px-12 py-16">
              {children}
            </main>
          </ScrollableContent>
          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
