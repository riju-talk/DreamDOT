"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../../../components/app-sidebar"
import { TopNav } from "../../../components/top-nav"
import { MobileNav } from "../../../components/mobile-nav"
import { ChatSidebar } from "../../../components/chat-sidebar"
import { ChatWindow } from "../../../components/chat-window"
import { ChatProvider, useChat } from "@/lib/chat-context"

function ChatArea() {
  const { activeConversation } = useChat()

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden w-full">
      <div className={`${activeConversation ? "hidden md:flex" : "flex"} md:flex md:w-80 border-r border-border overflow-hidden flex-shrink-0`}>
        <ChatSidebar />
      </div>
      <div className={`${activeConversation ? "flex" : "hidden md:flex"} md:flex flex-1 min-w-0 overflow-hidden`}>
        <ChatWindow />
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden min-h-0">
        <div className="flex-shrink-0 z-30">
          <TopNav />
        </div>
        <ChatProvider>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatArea />
          </div>
        </ChatProvider>
        <div className="flex-shrink-0 z-50">
          <MobileNav />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
