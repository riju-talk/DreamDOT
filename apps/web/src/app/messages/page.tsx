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
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className={`${activeConversation ? "hidden md:flex" : "flex"} md:flex w-full md:w-auto`}>
        <ChatSidebar />
      </div>
      <div className={`${activeConversation ? "flex" : "hidden md:flex"} md:flex flex-1 min-w-0`}>
        <ChatWindow />
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full overflow-x-clip">
        <AppSidebar />
        <SidebarInset className="min-w-0 flex-1 flex flex-col overflow-hidden">
          <TopNav />
          <ChatProvider>
            <ChatArea />
          </ChatProvider>
          <MobileNav />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
