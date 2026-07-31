"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { TopNav } from "../../../components/top-nav"
import { MobileNav } from "../../../components/mobile-nav"
import { ChatSidebar } from "../../../components/chat-sidebar"
import { ChatWindow } from "../../../components/chat-window"
import { ChatProvider } from "@/lib/chat-context"

export default function MessagesPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <ChatProvider>
            <div className="flex flex-1 overflow-hidden">
              <ChatSidebar />
              <ChatWindow />
            </div>
          </ChatProvider>
          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
